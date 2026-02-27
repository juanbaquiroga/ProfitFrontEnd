"use client"

import { SearchBar } from "@/components/shared/SearchBar";
import { VentasTable } from "@/components/shared/VentasTable";
import { useVentas } from "@/hooks/useVentas";
import { useState } from "react";

export default function Ventas() {
    const { data, isLoading, isError } = useVentas();
    const [globalFilter, setGlobalFilter] = useState("");

    return (
        <div className="flex h-full flex-row w-full overflow-hidden bg-white">
            <div className="flex w-full flex-col gap-4 p-4 h-full overflow-hidden">
                <div className="flex justify-between items-center px-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Historial de Ventas</h1>
                </div>
                <div className="w-full">
                    <SearchBar value={globalFilter} onChange={setGlobalFilter} />
                </div>

                {isLoading ? (
                    <div className="flex flex-1 justify-center items-center bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-500">Cargando historial de ventas...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex flex-1 justify-center items-center bg-red-50/50 rounded-xl border border-red-100">
                        <p className="text-sm font-medium text-red-500">Hubo un error al cargar las ventas. Por favor, intenta de nuevo más tarde.</p>
                    </div>
                ) : (
                    <VentasTable
                        data={data || []}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        pagination={true}
                        pageSize={15}
                    />
                )}
            </div>
        </div>
    );
}
