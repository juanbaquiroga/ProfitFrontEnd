"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getPaginationRowModel,
    type ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { VentaDTO } from "@/types/venta.types";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Filter, Download, Plus } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface VentasTableProps {
    data: VentaDTO[];
    globalFilter?: string;
    setGlobalFilter?: (value: string) => void;
    pagination?: boolean;
    pageSize?: number;
    hideContainerStyles?: boolean;
    showSearch?: boolean;
}

export const VentasTable = ({
    data,
    globalFilter: externalGlobalFilter,
    setGlobalFilter: externalSetGlobalFilter,
    pagination = false,
    pageSize = 10,
    hideContainerStyles = false,
    showSearch = false,
}: VentasTableProps) => {
    const [selectedVenta, setSelectedVenta] = useState<VentaDTO | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Allow internal search state if not provided contextually
    const [internalSearch, setInternalSearch] = useState("");
    const globalFilter = externalGlobalFilter !== undefined ? externalGlobalFilter : internalSearch;
    const setGlobalFilter = externalSetGlobalFilter || setInternalSearch;

    const handleRowClick = (venta: VentaDTO) => {
        setSelectedVenta(venta);
        setIsDialogOpen(true);
    };

    const mockStatuses = [
      { label: "Completado", bg: "bg-profit/10", text: "text-profit" }
    ];

    const columns: ColumnDef<VentaDTO>[] = [
        {
            accessorKey: "id",
            header: "ID Pedido",
            cell: ({ row }) => (
              <span className="font-bold text-slate-700 text-[14px]">
                #ORD-{(row.getValue("id") as number).toString().padStart(3, '0')}
              </span>
            )
        },
        {
            accessorKey: "fecha",
            header: "Fecha y Hora",
            cell: ({ row }) => {
                const dateStr = row.getValue("fecha") as string;
                let dateString = "--/--/----";
                let timeString = "--:-- --";
                if(dateStr) {
                  const date = new Date(dateStr);
                  dateString = date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
                  timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }

                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-[13px]">
                            {dateString}
                        </span>
                        <span className="text-[13px] text-profit font-medium">
                            {timeString}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "items",
            header: "Artículos",
            cell: ({ row }) => {
                const lineas = row.original.lineas || [];
                let itemsStr = lineas.map(l => `${l.cantidad}x ${l.productoNombre}`).join(", ");
                if (itemsStr.length > 40) itemsStr = itemsStr.substring(0, 40) + "...";
                if (!itemsStr) itemsStr = "Productos no detallados";

                return (
                    <span className="text-[14px] text-slate-600 font-medium">
                        {itemsStr}
                    </span>
                );
            }
        },
        {
            accessorKey: "total",
            header: "Total",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("total")) || 0;
                return <span className="font-extrabold text-slate-900 text-[14.5px]">${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            }
        },
        {
            id: "estado",
            header: "Estado",
            cell: () => {
                const status = mockStatuses[0];
                return (
                  <span className={`px-3 py-1 rounded-full text-[12px] font-bold tracking-wide ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                )
            }
        },
        {
            id: "acciones",
            header: () => <div className="text-right pr-4">Acción</div>,
            cell: () => (
              <div className="text-right pr-4">
                <button className="text-[14px] font-bold text-profit hover:brightness-95 transition-colors shrink-0">
                  Ver
                </button>
              </div>
            )
        }
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        initialState: {
            pagination: pagination ? { pageSize: pageSize } : undefined,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            const search = filterValue.toLowerCase();
            const v = row.original;
            
            // Buscar por ID, Total, o Nombre de Producto en lineas
            const matchesId = String(v.id).includes(search);
            const matchesTotal = String(v.total).includes(search);
            const matchesProducts = v.lineas?.some(linea => 
                linea.productoNombre?.toLowerCase().includes(search)
            );
            
            return Boolean(matchesId || matchesTotal || matchesProducts);
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    });

    return (
        <div className={`w-full h-full flex flex-col min-h-0 ${!hideContainerStyles ? 'rounded-[20px] border border-profit/10 bg-white shadow-sm' : ''}`}>
            
            {showSearch && (
                <div className="px-8 py-5 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-t-[20px] shrink-0">
                    <div className="w-full max-w-md">
                        <SearchBar value={globalFilter} onChange={setGlobalFilter} />
                    </div>
                </div>
            )}
            
            <div className={`flex-1 overflow-auto ${!showSearch ? 'rounded-t-[20px]' : ''}`}>
                <Table className="w-full min-w-[600px] border-separate border-spacing-0">
                    <TableHeader className="sticky top-0 z-20 bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-gray-50 border-none shadow-sm">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-[13px] font-bold text-[#8C9B9D] h-[52px] border-b border-slate-100 bg-white"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b border-gray-50/50 hover:bg-profit/5 transition-colors cursor-pointer"
                                    onClick={() => handleRowClick(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="py-[18px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-400 font-medium text-sm">
                                    No se encontraron transacciones para mostrar.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && (
                <div className="flex-none flex items-center justify-between px-6 py-4 border-t bg-white rounded-b-xl border-slate-100/50 relative z-10">
                    <div className="flex-1 text-[13px] text-slate-500 font-medium">
                        Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} venta(s).
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2 text-[13px] font-bold text-slate-600">
                            <p>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0 border-slate-200 text-slate-500 hover:bg-profit/10 hover:text-profit hover:border-profit/30 transition-colors disabled:opacity-50 appearance-none rounded-xl"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Página anterior</span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0 border-slate-200 text-slate-500 hover:bg-profit/10 hover:text-profit hover:border-profit/30 transition-colors disabled:opacity-50 appearance-none rounded-xl"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Página siguiente</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Detalle de Venta */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-800 font-bold">
                            Detalle de la Venta <span className="text-profit uppercase">#ORD-{selectedVenta?.id?.toString().padStart(3, '0')}</span>
                        </DialogTitle>
                        {selectedVenta?.fecha && (
                            <div className="text-[14px] text-slate-500 font-medium mt-1">
                                {new Date(selectedVenta.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })} a las {new Date(selectedVenta.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        )}
                    </DialogHeader>

                    <div className="mt-4">
                        <div className="rounded-[16px] border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-[#FAFBFA] border-b border-gray-100">
                                    <tr>
                                        <th className="px-5 py-4 text-left font-bold text-[#8C9B9D] text-[13px]">Producto</th>
                                        <th className="px-5 py-4 text-left font-bold text-[#8C9B9D] text-[13px]">Categoría</th>
                                        <th className="px-5 py-4 text-right font-bold text-[#8C9B9D] text-[13px]">Cantidad</th>
                                        <th className="px-5 py-4 text-right font-bold text-[#8C9B9D] text-[13px]">Precio Unitario</th>
                                        <th className="px-5 py-4 text-right font-bold text-[#8C9B9D] text-[13px]">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {selectedVenta?.lineas?.map((linea, index) => (
                                        <tr key={index} className="hover:bg-profit/5 transition-colors">
                                            <td className="px-5 py-4 text-slate-800 font-bold text-[14px]">
                                                {linea.productoNombre || 'Producto Desconocido'}
                                            </td>
                                            <td className="px-5 py-4">
                                                {linea.categoriaNombre ? (
                                                    <Badge variant="secondary" className="font-bold text-[11px] bg-slate-100 text-slate-600 rounded-md">
                                                        {linea.categoriaNombre}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-slate-400 italic text-[12px]">Sin categoría</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-right font-bold text-slate-600 text-[14px]">
                                                {linea.cantidad || 0}
                                            </td>
                                            <td className="px-5 py-4 text-right text-profit font-medium text-[14px]">
                                                ${(linea.precioUnitario || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-5 py-4 text-right text-slate-800 font-bold text-[14px]">
                                                ${(linea.subtotal || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!selectedVenta?.lineas || selectedVenta.lineas.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-5 py-8 text-center text-slate-400 font-medium text-sm">
                                                No hay productos en esta venta.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-[#FAFBFA] border-t border-gray-100">
                                    <tr>
                                        <td colSpan={4} className="px-5 py-5 text-right font-bold text-slate-600 text-[13px] uppercase tracking-wider">
                                            TOTAL
                                        </td>
                                        <td className="px-5 py-5 text-right font-black text-slate-900 text-[16px]">
                                            ${(selectedVenta?.total || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};