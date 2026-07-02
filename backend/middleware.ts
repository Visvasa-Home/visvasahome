import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 1. Retrieve session
  const { data: { session } } = await supabase.auth.getSession();
  const url = req.nextUrl.clone();

  // Public assets and login bypass
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname === '/login' ||
    req.nextUrl.pathname === '/'
  ) {
    return res;
  }

  // 2. Redirect to /login if no valid token
  if (!session) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  const userId = session.user.id;

  // 3. Look up user role across the three tables concurrently to prevent sequential waterfall delays
  const [
    { data: admin },
    { data: partner },
    { data: customer }
  ] = await Promise.all([
    supabase.from('admins').select('role').eq('auth_user_id', userId).maybeSingle(),
    supabase.from('partners').select('status').eq('auth_user_id', userId).maybeSingle(),
    supabase.from('customers').select('id').eq('auth_user_id', userId).maybeSingle()
  ]);

  if (admin) {
    if (!req.nextUrl.pathname.startsWith('/admin')) {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (partner) {
    if (!req.nextUrl.pathname.startsWith('/partner')) {
      url.pathname = '/partner/dashboard';
      return NextResponse.redirect(url);
    }
    return res;
  }

  if (customer) {
    if (!req.nextUrl.pathname.startsWith('/customer')) {
      url.pathname = '/customer/dashboard';
      return NextResponse.redirect(url);
    }
    return res;
  }

  // If user is authenticated but not registered in any profile table
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
