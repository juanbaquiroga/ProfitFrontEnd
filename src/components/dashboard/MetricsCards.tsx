import { DollarSign, ShoppingCart, AlertTriangle, Star } from "lucide-react";
import { Product } from "@/types/product.types";
import { VentaDTO } from "@/types/venta.types";
import { DateFilterOption } from "./DashboardHeader";

interface MetricsCardsProps {
  products: Product[];
  ventas: VentaDTO[];
  dateFilter: DateFilterOption;
}

export function MetricsCards({ products, ventas, dateFilter }: MetricsCardsProps) {
  
  const getDates = (filter: DateFilterOption) => {
    const currentStart = new Date();
    const prevStart = new Date();
    const prevEnd = new Date();
    
    currentStart.setHours(0,0,0,0);
    prevStart.setHours(0,0,0,0);
    prevEnd.setHours(23,59,59,999);
    
    if (filter === 'today') {
      prevStart.setDate(currentStart.getDate() - 1);
      prevEnd.setDate(currentStart.getDate() - 1);
    } else if (filter === 'week') {
      currentStart.setDate(currentStart.getDate() - 6); // Last 7 days including today
      prevStart.setDate(currentStart.getDate() - 7);
      prevEnd.setDate(currentStart.getDate() - 1);
    } else if (filter === 'month') {
      currentStart.setDate(currentStart.getDate() - 29); // Last 30 days
      prevStart.setDate(currentStart.getDate() - 30);
      prevEnd.setDate(currentStart.getDate() - 1);
    } else {
      currentStart.setTime(0);
      prevStart.setTime(0);
      prevEnd.setTime(0);
    }
    return { currentStart, prevStart, prevEnd };
  };

  const { currentStart, prevStart, prevEnd } = getDates(dateFilter);

  // Ventas del periodo actual vs periodo anterior
  const currentPeriodVentas = ventas.filter(v => {
    if(!v.fecha) return false;
    const vDate = new Date(v.fecha);
    return dateFilter === 'all' ? true : vDate >= currentStart;
  });

  const previousPeriodVentas = ventas.filter(v => {
    if(!v.fecha) return false;
    const vDate = new Date(v.fecha);
    return dateFilter === 'all' ? false : (vDate >= prevStart && vDate <= prevEnd);
  });

  const totalSalesToday = currentPeriodVentas.reduce((sum, v) => sum + v.total, 0);
  const totalSalesYesterday = previousPeriodVentas.reduce((sum, v) => sum + v.total, 0);
  
  // % Increase for Sales
  let salesIncrease = "0%";
  let salesIncreaseColor = "text-profit";
  if (dateFilter === 'all') {
    salesIncrease = "Histórico";
    salesIncreaseColor = "text-slate-400";
  } else if (totalSalesYesterday > 0) {
    const change = ((totalSalesToday - totalSalesYesterday) / totalSalesYesterday) * 100;
    salesIncrease = (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
    salesIncreaseColor = change >= 0 ? "text-profit" : "text-amber-500";
  } else if (totalSalesToday > 0) {
    salesIncrease = "+100%";
  }

  // Pedidos de hoy vs ayer
  const ordersToday = currentPeriodVentas.length;
  const ordersYesterday = previousPeriodVentas.length;
  
  let ordersIncrease = "0%";
  let ordersIncreaseColor = "text-profit";
  if (dateFilter === 'all') {
    ordersIncrease = "Histórico";
    ordersIncreaseColor = "text-slate-400";
  } else if (ordersYesterday > 0) {
    const change = ((ordersToday - ordersYesterday) / ordersYesterday) * 100;
    ordersIncrease = (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
    ordersIncreaseColor = change >= 0 ? "text-profit" : "text-amber-500";
  } else if (ordersToday > 0) {
    ordersIncrease = "+100%";
  }
  
  // calculate low stock (productos habilitados y stock < 10)
  const lowStockProducts = products.filter(p => p.habilitado && p.stock < 10).length;
  
  // top products based on CURRENT PERIOD only
  const productQuantities: Record<string, number> = {};
  currentPeriodVentas.forEach(venta => {
    venta.lineas?.forEach(linea => {
      productQuantities[linea.productoNombre] = (productQuantities[linea.productoNombre] || 0) + linea.cantidad;
    });
  });

  const sortedProducts = Object.entries(productQuantities).sort((a, b) => b[1] - a[1]);
  const top2Products = sortedProducts.slice(0, 2).map(p => p[0]);
  let topProductsName = "Sin ventas";
  if (top2Products.length > 0) {
    topProductsName = top2Products.join(", ");
  }

  const topProductsVentas = sortedProducts.length > 0 ? `(${sortedProducts[0][1]} uds)` : "";

  const periodLabels: Record<DateFilterOption, string> = {
    today: "VENTAS DE HOY",
    week: "VENTAS DE LA SEMANA",
    month: "VENTAS DEL MES",
    all: "VENTAS TOTALES"
  };

  const ordersLabels: Record<DateFilterOption, string> = {
    today: "PEDIDOS HOY",
    week: "PEDIDOS SEMANA",
    month: "PEDIDOS MES",
    all: "PEDIDOS TOTALES"
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card
        icon={<DollarSign className="w-[22px] h-[22px] text-profit" />}
        iconBg="bg-profit/10"
        title={periodLabels[dateFilter]}
        value={`$${totalSalesToday.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
        trend={salesIncrease}
        trendColor={salesIncreaseColor}
      />
      <Card
        icon={<ShoppingCart className="w-[22px] h-[22px] text-[#4FA5FF]" />}
        iconBg="bg-[#EEF5FF]"
        title={ordersLabels[dateFilter]}
        value={ordersToday.toString()}
        trend={ordersIncrease}
        trendColor={ordersIncreaseColor}
      />
      <Card
        icon={<AlertTriangle className="w-[22px] h-[22px] text-[#FFB340]" />}
        iconBg="bg-[#FFF8EE]"
        title="PRODUCTOS STOCK BAJO"
        value={lowStockProducts.toString()}
        trend="Alerta"
        trendColor="text-amber-600"
      />
      <Card
        icon={<Star className="w-[22px] h-[22px] text-[#B854FF]" />}
        iconBg="bg-[#F6EEFF]"
        title="PRODUCTOS MAS VENDIDOS"
        value={topProductsName}
        trend={topProductsVentas}
        trendColor="text-[#B854FF]"
      />
    </div>
  );
}

function Card({ icon, iconBg, title, value, trend, trendColor }: any) {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-sm border border-profit/10 flex items-center gap-5 cursor-default">
      <div className={`w-[52px] h-[52px] shrink-0 rounded-[14px] flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <h3 className="text-[11px] font-bold text-[#8C9B9D] tracking-wider uppercase truncate">{title}</h3>
        <div className="flex items-baseline gap-2 truncate">
          <span className="text-[24px] font-bold text-slate-800 tracking-tight">{value}</span>
          <span className={`text-[13px] font-bold ${trendColor}`}>{trend}</span>
        </div>
      </div>
    </div>
  );
}
