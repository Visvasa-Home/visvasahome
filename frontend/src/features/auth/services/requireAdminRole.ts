import { supabase } from '@core/db/supabaseClient';

export type AdminRole = 'super_admin' | 'operations_manager' | 'support_agent';

export interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  is_active: boolean;
}

// Client-side representation of the requireAdminRole middleware check.
// In a server environment, this would run as an API middleware.
// Here, we run it as a unified safety boundary check before executing operations.
export async function requireAdminRole(sectionId: string, requiresWrite: boolean = false): Promise<AdminUser> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    throw new Error('Unauthorized: No active authentication session found.');
  }

  const userId = session.user.id;

  // Real Database Query (Checked on the Postgres backend via RLS policies)
  const { data: admin, error: dbError } = await supabase
    .from('admins')
    .select('*')
    .eq('auth_user_id', userId)
    .single();

  if (dbError || !admin) {
    throw new Error('Unauthorized: Not a registered administrator account.');
  }

  if (!admin.is_active) {
    throw new Error('Forbidden: Your administrator account has been deactivated.');
  }

  // Fetch permissions configuration dynamically from role_permissions table
  const { data: rolePerms, error: permError } = await supabase
    .from('role_permissions')
    .select('*')
    .eq('role', admin.role)
    .single();

  if (permError || !rolePerms) {
    throw new Error('Unauthorized: Admin role permissions configuration not found in database.');
  }

  const hasSectionAccess = rolePerms.allowed_sections.includes(sectionId);
  const hasWriteAccess = !requiresWrite || rolePerms.can_write;

  if (!hasSectionAccess || !hasWriteAccess) {
    throw new Error(`Forbidden: Role '${admin.role}' does not have the required permissions for the ${sectionId} section.`);
  }

  return admin as AdminUser;
}

// Log sensitive actions into database audit trail
export async function logAdminAction(
  adminId: string,
  action: string,
  targetTable?: string,
  targetId?: string,
  metadata?: any
) {
  try {
    await supabase.from('admin_audit_log').insert([
      {
        admin_id: adminId,
        action,
        target_table: targetTable,
        target_id: targetId,
        metadata: metadata ? JSON.stringify(metadata) : null,
        created_at: new Date().toISOString()
      }
    ]);
    console.log(`[AUDIT LOG] Admin:${adminId} performed action:${action}`);
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
}
