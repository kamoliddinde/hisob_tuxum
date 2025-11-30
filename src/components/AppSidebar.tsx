import { Home, ShoppingCart, Wallet, Package, FileText, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

interface AppSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: "bosh-sahifa", label: "Bosh sahifa", icon: Home },
  { id: "savdo", label: "Savdo", icon: ShoppingCart },
  { id: "ombor", label: "Ombor", icon: Package },
  { id: "qarzlar", label: "Qarzlar", icon: Wallet },
  { id: "hisobotlar", label: "Hisobotlar", icon: FileText },
  { id: "sozlamalar", label: "Sozlamalar", icon: Settings },
];

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <div className="px-6 py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Package className="size-5 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Tuxum Savdo</h2>
                <p className="text-sm text-gray-500">Boshqaruv tizimi</p>
              </div>
            </div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="px-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                    className="rounded-xl"
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
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
