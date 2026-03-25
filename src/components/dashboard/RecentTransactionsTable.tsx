import { Filter, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VentasTable } from "@/components/shared/VentasTable";
import { VentaDTO } from "@/types/venta.types";
import { DateFilterOption } from "./DashboardHeader";
import Link from "next/link";

interface RecentTransactionsTableProps {
  ventas: VentaDTO[];
  dateFilter: DateFilterOption;
}

export function RecentTransactionsTable({ ventas, dateFilter }: RecentTransactionsTableProps) {
  
  const getStartDate = (filter: DateFilterOption) => {
    const currentStart = new Date();
    currentStart.setHours(0,0,0,0);
    if (filter === 'week') currentStart.setDate(currentStart.getDate() - 6);
    else if (filter === 'month') currentStart.setDate(currentStart.getDate() - 29);
    else if (filter === 'all') currentStart.setTime(0);
    return currentStart;
  };

  const startDate = getStartDate(dateFilter);

  // Filtrar y ordenar
  const displayVentas = [...ventas]
    .filter(v => {
      if (!v.id) return false;
      if (!v.fecha) return false;
      if (dateFilter === 'all') return true;
      return new Date(v.fecha) >= startDate;
    })
    .sort((a, b) => b.id - a.id);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-profit/10 overflow-hidden flex-1 flex flex-col mb-6">
      <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-slate-800">Transacciones Recientes</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-[38px] rounded-xl px-4 text-profit border-profit/20 bg-white hover:bg-profit/10 flex items-center font-bold text-[13px] shadow-sm">
            <Download className="w-[15px] h-[15px] mr-2" /> Exportar
          </Button>
          <Link href="/ventas" passHref>
            <Button variant="outline" className="h-[38px] rounded-xl px-4 text-profit border-profit/20 bg-white hover:bg-profit/10 flex items-center font-bold text-[13px] shadow-sm">
              <ArrowRight className="w-[15px] h-[15px] mr-2" /> Ver Todas
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <VentasTable 
          data={displayVentas} 
          pagination={false} 
          hideContainerStyles={true}
          showSearch={false}
        />
      </div>
    </div>
  );
}
