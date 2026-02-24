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
        label: "Venta Rapida",
        icon: ShoppingBasket,
        href: "/sell"
    },
    { 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        href: "/dashboard" 
    },
    { 
        label: "Stock", 
        icon: Package, 
        href: "/stock" 
    },
    { 
        label: "Ventas", 
        icon: BadgeDollarSign, 
        href: "/ventas" 
    },
    { 
        label: "Proveedores", 
        icon: Users, 
        href: "/proveedores" 
    },
];

export const SETTINGS_ROUTE = {
  label: "Configuración",
  icon: Settings,
  href: "/settings"
};