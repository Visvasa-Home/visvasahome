import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, ShoppingBag, CreditCard, Star, Bell, Settings, BarChart } from 'lucide-react';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", url: "/dashboard/customers", icon: Users },
  { title: "Partners", url: "/dashboard/partners", icon: UserCog },
  { title: "Orders", url: "/dashboard/orders", icon: ShoppingBag },
  { title: "Payments", url: "/dashboard/payments", icon: CreditCard },
  { title: "Reviews", url: "/dashboard/reviews", icon: Star },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Reports", url: "/dashboard/reports", icon: BarChart },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4 flex h-14 items-center">
        <h2 className="text-lg font-bold tracking-tight text-primary">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                      }
                      end={item.url === '/dashboard'} // exact match for dashboard home
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
