import { 
  LayoutDashboard, 
  Package,         
  BadgeDollarSign, 
  Users,           
  Settings,
  ShoppingBasket
} from "lucide-react";

export const DASHBOARD_ROUTES = [
    {
        label: "Inicio",
        icon: ShoppingBasket,
        href: "/sell"
    },
    { 
        label: "Stock", 
        icon: Package, 
        href: "/stock" 
    },
    { 
        label: "Proveedores", 
        icon: Users, 
        href: "/proveedores" 
    },
    { 
        label: "Ventas", 
        icon: BadgeDollarSign, 
        href: "/ventas" 
    },
    { 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        href: "/dashboard" 
    },
];

export const SETTINGS_ROUTE = {
  label: "Configuración",
  icon: Settings,
  href: "/settings"
};