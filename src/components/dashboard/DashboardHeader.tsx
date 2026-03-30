import { Search, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export type DateFilterOption = 'today' | 'week' | 'month' | 'all';

interface DashboardHeaderProps {
  dateFilter: DateFilterOption;
  setDateFilter: (val: DateFilterOption) => void;
}

export function DashboardHeader({ dateFilter, setDateFilter }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full h-[88px] px-8 bg-white border-b border-profit/10 sticky top-0 z-10 shrink-0">
      <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Resumen del Panel</h1>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text" />
          <Select value={dateFilter} onValueChange={(val: DateFilterOption) => setDateFilter(val)}>
            <SelectTrigger className="w-[180px] h-[46px] rounded-xl border-profit/20 bg-profit/5 text-[14px] font-bold text-slate-700 shadow-sm focus:ring-profit/20">
              <SelectValue placeholder="Filtrar por fecha" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-profit/20 shadow-lg">
              <SelectItem value="today" className="font-medium">Hoy</SelectItem>
              <SelectItem value="week" className="font-medium">Esta Semana</SelectItem>
              <SelectItem value="month" className="font-medium">Este Mes</SelectItem>
              <SelectItem value="all" className="font-medium">Todos los Tiempos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Link href="/sell" passHref>
          <Button className="h-[46px] px-6 rounded-xl bg-profit hover:brightness-95 text-slate-900 font-bold shadow-sm shadow-profit/30 transition-all active:scale-95 ml-2">
            <Plus className="mr-2 h-[18px] w-[18px] stroke-3" /> Nuevo Pedido
          </Button>
        </Link>
      </div>
    </div>
  );
}
