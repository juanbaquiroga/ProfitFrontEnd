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
import { Badge } from "@/components/ui/badge"; // ✅ Importamos Badge para la categoría
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface VentasTableProps {
    data: VentaDTO[];
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    pagination?: boolean;
    pageSize?: number;
}

export const VentasTable = ({
    data,
    globalFilter,
    setGlobalFilter,
    pagination = false,
    pageSize = 10
}: VentasTableProps) => {
    const [selectedVenta, setSelectedVenta] = useState<VentaDTO | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleRowClick = (venta: VentaDTO) => {
        setSelectedVenta(venta);
        setIsDialogOpen(true);
    };

    const columns: ColumnDef<VentaDTO>[] = [
        {
            accessorKey: "id",
            header: "NRO. VENTA",
            cell: ({ row }) => <span className="text-muted-foreground text-xs uppercase font-mono font-bold">#{row.getValue("id")}</span>
        },
        {
            accessorKey: "fecha",
            header: "FECHA",
            cell: ({ row }) => {
                const dateStr = row.getValue("fecha") as string;
                const date = new Date(dateStr);
                return (
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                            {date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                            {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "items",
            header: "CANTIDAD DE LÍNEAS",
            cell: ({ row }) => {
                const lineas = row.original.lineas || [];
                // ✅ Fallback a 0 si la cantidad viene indefinida
                const numItems = lineas.reduce((acc, curr) => acc + (curr.cantidad || 0), 0);
                return (
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{lineas.length} prod. ({numItems} unid.)</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "total",
            header: "TOTAL",
            cell: ({ row }) => {
                // ✅ Fallback a 0 si el total viene indefinido
                const amount = parseFloat(row.getValue("total")) || 0;
                return <span className="font-bold text-primary text-lg">${amount.toLocaleString('es-AR')}</span>
            }
        }
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    });

    return (
        <div className="w-full h-full flex flex-col min-h-0">
            <div className="rounded-xl border bg-card flex flex-col min-h-0 relative flex-1 shadow-sm">

                <div className="flex-1 overflow-auto">
                    <table className="w-full caption-bottom text-sm relative border-separate border-spacing-0">
                        <TableHeader className="sticky top-0 z-20 shadow-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="border-none">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-[10px] font-bold py-4 bg-slate-50 first:rounded-tl-xl last:rounded-tr-xl tracking-wider text-slate-500"
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
                                        className="hover:bg-slate-50 border-b last:border-0 transition-colors cursor-pointer"
                                        onClick={() => handleRowClick(row.original)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                        No se encontraron ventas.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </table>
                </div>

                {pagination && (
                    <div className="flex-none flex items-center justify-between px-4 py-3 border-t bg-card rounded-b-xl border-slate-100">
                        <div className="flex-1 text-[13px] text-muted-foreground font-medium">
                            Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} venta(s).
                        </div>
                        <div className="flex items-center space-x-6 lg:space-x-8">
                            <div className="flex items-center space-x-2 text-[13px] font-medium text-slate-500">
                                <p>Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0 rounded-full border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    <span className="sr-only">Página anterior</span>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0 rounded-full border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
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
            </div>

            {/* Modal Detalle de Venta */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {/* ✅ Cambiamos max-w-3xl por max-w-4xl para hacer el popup más grande */}
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-slate-800">
                            Detalle de la Venta <span className="text-primary font-mono uppercase">#{selectedVenta?.id}</span>
                        </DialogTitle>
                        {selectedVenta?.fecha && (
                            <div className="text-sm text-muted-foreground mt-1">
                                {new Date(selectedVenta.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })} a las {new Date(selectedVenta.fecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        )}
                    </DialogHeader>

                    <div className="mt-4">
                        <div className="rounded-md border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold text-slate-600">Producto</th>
                                        {/* ✅ Nueva columna para la Categoría */}
                                        <th className="px-4 py-3 text-left font-semibold text-slate-600">Categoría</th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-600">Cantidad</th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-600">Precio Unitario</th>
                                        <th className="px-4 py-3 text-right font-semibold text-slate-600">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {selectedVenta?.lineas?.map((linea, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 text-slate-700 font-medium">
                                                {linea.productoNombre || 'Producto Desconocido'}
                                            </td>
                                            {/* ✅ Nueva celda mostrando la categoría */}
                                            <td className="px-4 py-3">
                                                {linea.categoriaNombre ? (
                                                    <Badge variant="secondary" className="font-normal text-[11px] bg-slate-100 text-slate-600">
                                                        {linea.categoriaNombre}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-slate-400 italic text-xs">Sin categoría</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-600">
                                                {linea.cantidad || 0}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-600">
                                                ${(linea.precioUnitario || 0).toLocaleString('es-AR')}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-800 font-medium">
                                                ${(linea.subtotal || 0).toLocaleString('es-AR')}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!selectedVenta?.lineas || selectedVenta.lineas.length === 0) && (
                                        <tr>
                                            {/* ✅ Actualizado colSpan a 5 */}
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No hay productos en esta venta.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t border-slate-200">
                                    <tr>
                                        {/* ✅ Actualizado colSpan a 4 */}
                                        <td colSpan={4} className="px-4 py-3 text-right font-bold text-slate-700">
                                            TOTAL
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-primary text-lg">
                                            ${(selectedVenta?.total || 0).toLocaleString('es-AR')}
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