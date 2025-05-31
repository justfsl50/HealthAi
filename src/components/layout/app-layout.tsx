
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react'; // Added useEffect
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  FileSearch,
  BotMessageSquare,
  Hospital,
  CalendarCheck,
  Pill,
  HeartPulse,
  FileText as MedicalRecordIcon,
  LogIn,
  LogOut,
  UserPlus,
  UserCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', authRequired: true },
  { href: '/symptom-analyzer', icon: FileSearch, label: 'Symptom Analyzer', authRequired: true },
  { href: '/health-advisor', icon: BotMessageSquare, label: 'Health Advisor', authRequired: true },
  { href: '/hospital-locator', icon: Hospital, label: 'Hospital Locator', authRequired: true },
  { href: '/appointments', icon: CalendarCheck, label: 'Appointments', authRequired: true },
  { href: '/medications', icon: Pill, label: 'Medications', authRequired: true },
  { href: '/medical-records', icon: MedicalRecordIcon, label: 'Medical Records', authRequired: true },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  const visibleNavItems = navItems.filter(item => !item.authRequired || (item.authRequired && user));

  let pageTitle = 'HealthLink AI';
  const currentNavItem = navItems.find(item => item.href === pathname);
  if (currentNavItem) {
    pageTitle = currentNavItem.label;
  } else if (pathname === '/login') {
    pageTitle = 'Login';
  } else if (pathname === '/signup') {
    pageTitle = 'Sign Up';
  }

  useEffect(() => {
    // If no user and trying to access an auth-required page, redirect to login
    // This is a client-side redirect. Proper middleware would be better for SSR.
    if (!loading && !user && currentNavItem?.authRequired && pathname !== '/login' && pathname !== '/signup') {
      if (typeof window !== 'undefined') { // Ensure router.push is called client-side
        router.push('/login');
      }
    }
  }, [loading, user, currentNavItem, pathname, router]); // Added dependencies

  if (loading && pathname !== '/login' && pathname !== '/signup') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If we are still redirecting (conditions for redirect met), show loading
  if (!loading && !user && currentNavItem?.authRequired && pathname !== '/login' && pathname !== '/signup') {
     return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }

  if (pathname === '/login' || pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" side="left">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Button variant="ghost" size="icon" className="text-primary group-data-[collapsible=icon]:text-sidebar-foreground">
              <HeartPulse className="h-7 w-7" />
            </Button>
            <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
              HealthLink AI
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent asChild>
          <ScrollArea className="h-full">
            {user && (
              <SidebarMenu className="p-2">
                {visibleNavItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={{ children: item.label, className: "bg-card text-card-foreground border-border" }}
                        className="justify-start"
                      >
                        <a>
                          <item.icon />
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </ScrollArea>
        </SidebarContent>
         {user && (
          <SidebarFooter className="p-2 border-t border-sidebar-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
                    <Avatar className="h-7 w-7 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                      <AvatarFallback className="text-xs">
                        {user.email ? user.email.charAt(0).toUpperCase() : <UserCircle />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate group-data-[collapsible=icon]:hidden text-sm">
                      {user.email || "User Profile"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email || "User Profile"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </SidebarFooter>
        )}
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <div className="md:hidden">
             <SidebarTrigger />
          </div>
          <div className="hidden md:flex items-center">
             <SidebarTrigger />
          </div>
          <h2 className="text-lg font-semibold text-foreground flex-1 truncate">
            {pageTitle}
          </h2>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} />
                      <AvatarFallback>
                        {user.email ? user.email.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">{user.email || "User Profile"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" passHref>
                  <Button variant="outline" size="sm">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link href="/signup" passHref>
                  <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
