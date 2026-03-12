import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Globe,
  TrendingUp,
  BarChart3,
  Target,
  DollarSign,
  CreditCard,
  Package,
  Calculator,
  AlertTriangle,
  Shield,
  CheckCircle,
  MessageSquare,
  Home,
  Building2,
  GraduationCap,
  Settings,
  LogOut,
  ChevronDown,
  FileText,
  LineChart,
  Brain,
  Upload,
  Bell,
  FolderOpen,
  Lightbulb,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ------------------------------------------------------------------ */
/*  Navigation data                                                    */
/* ------------------------------------------------------------------ */

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  items: NavItem[];
}

const solutionGroups: NavGroup[] = [
  {
    label: "Analytics",
    icon: BarChart3,
    defaultOpen: true,
    items: [
      { title: "Economic Indicators", url: "/economic-indicators", icon: Globe },
      { title: "Business Forecast", url: "/business-forecast", icon: TrendingUp },
      { title: "Market Analysis", url: "/market-competitive-analysis", icon: BarChart3 },
      { title: "Sales Intelligence", url: "/sales-intelligence", icon: MessageSquare },
    ],
  },
  {
    label: "Finance",
    icon: DollarSign,
    items: [
      { title: "Revenue Strategy", url: "/revenue-forecasting", icon: LineChart },
      { title: "Pricing Strategy", url: "/pricing-strategies", icon: Target },
      { title: "Financial Advisory", url: "/financial-advisory", icon: Calculator },
      { title: "Funding & Loans", url: "/loan-research", icon: CreditCard },
    ],
  },
  {
    label: "Operations",
    icon: Package,
    items: [
      { title: "Supply Chain", url: "/supply-chain-analytics", icon: Package },
      { title: "Tax & Compliance", url: "/tax-compliance", icon: Shield },
      { title: "Policy & Impact", url: "/impact-calculator", icon: AlertTriangle },
    ],
  },
  {
    label: "Planning",
    icon: Lightbulb,
    items: [
      { title: "Business Feasibility", url: "/business-feasibility", icon: CheckCircle },
      { title: "Business Planning", url: "/business-planning", icon: ClipboardList },
      { title: "Business Plans", url: "/business-plans", icon: FileText },
      { title: "Growth Planning", url: "/growth-planning", icon: TrendingUp },
      { title: "Strategy Builder", url: "/strategy-builder", icon: Target },
    ],
  },
  {
    label: "Tools",
    icon: Brain,
    items: [
      { title: "AI Insights", url: "/ai-insights", icon: Brain },
      { title: "Document Manager", url: "/document-manager", icon: FolderOpen },
      { title: "Document Upload", url: "/document-upload", icon: Upload },
      { title: "All Reports", url: "/all-reports", icon: FileText },
      { title: "Risk Management", url: "/risk-management", icon: AlertTriangle },
      { title: "Notifications", url: "/notifications", icon: Bell },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const initials = React.useMemo(() => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const isActive = (url: string) => location.pathname === url;
  const isGroupActive = (items: NavItem[]) =>
    items.some((i) => location.pathname.startsWith(i.url));

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="Home"
            >
              <Link to="/home">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F65b22f3aedf4439cb7708f60698fc899%2Fe85e18d5c9404f1da472bd3d9d893f87?format=webp&width=800"
                    alt="Joseph AI"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">Joseph AI</span>
                  <span className="text-[11px] text-muted-foreground">Intelligence Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Division links */}
      <SidebarGroup>
        <SidebarGroupLabel>Divisions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/home"} tooltip="Solutions">
                <Link to="/home">
                  <Home className="h-4 w-4" />
                  <span>Solutions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith("/infrastructure")} tooltip="Infrastructure">
                <Link to="/infrastructure">
                  <Building2 className="h-4 w-4" />
                  <span>Infrastructure</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith("/learn")} tooltip="Learn">
                <Link to="/learn">
                  <GraduationCap className="h-4 w-4" />
                  <span>Learn</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      {/* Module groups */}
      <SidebarContent>
        {solutionGroups.map((group) => (
          <Collapsible
            key={group.label}
            defaultOpen={group.defaultOpen || isGroupActive(group.items)}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center gap-2 [&[data-state=open]>svg.chevron]:rotate-180">
                  <group.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 text-left">{group.label}</span>
                  <ChevronDown className="chevron h-3.5 w-3.5 shrink-0 transition-transform duration-200" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={item.title}
                        >
                          <Link to={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  tooltip={user?.name || "Account"}
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "User"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || "User"}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/user-settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/company-settings")}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Company Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
