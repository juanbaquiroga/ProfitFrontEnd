"use client"
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useVentas } from "@/hooks/useVentas";
import { DashboardHeader, DateFilterOption } from "@/components/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";

export default function Dashboard() {
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: ventas = [], isLoading: isLoadingVentas } = useVentas();
  
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('today');

  const isLoading = isLoadingProducts || isLoadingVentas;

  return (
    <div className="flex h-full flex-col w-full bg-[#FAFBFA] overflow-y-auto font-sans relative">
      <DashboardHeader dateFilter={dateFilter} setDateFilter={setDateFilter} />
      
      <div className="p-8 max-w-[1400px] mx-auto w-full flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-profit/20 border-t-profit rounded-full animate-spin"></div>
              <p className="text-[15px] font-bold text-profit/80">Cargando métricas...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in duration-500 transition-all">
            <MetricsCards products={products} ventas={ventas} dateFilter={dateFilter} />
            <RecentTransactionsTable ventas={ventas} dateFilter={dateFilter} />
          </div>
        )}
      </div>
    </div>
  );
}
