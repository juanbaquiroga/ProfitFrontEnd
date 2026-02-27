"use client";

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getPaginationRowModel,
    type ColumnDef,
    type ColumnFiltersState
} from "@tanstack/react-table";
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product.types";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StockTableProps {
    data: Product[];
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    activeCategory?: string;
    activeAvailability?: string; // "all", "available", "out_of_stock"
    pagination?: boolean;
    pageSize?: number;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const StockTable = ({
    data,
    globalFilter,
    setGlobalFilter,
    activeCategory,
    activeAvailability,
    pagination = false,
    pageSize = 10,
    onEdit,
    onDelete
}: StockTableProps) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: "codigo",
            header: "CÓDIGO",
            cell: ({ row }) => <span className="text-muted-foreground text-xs uppercase font-mono font-bold">{row.getValue("codigo")}</span>
        },
        {
            accessorKey: "nombre",
            header: "PRODUCTO",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground line-clamp-1">{row.getValue("nombre")}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[180px]">
                        {row.original.descripcion}
                    </span>
                </div>
            )
        },
        {
            id: "categoria_nombre", // Usamos un ID custom para filtrar más facil
            accessorFn: (row) => row.categoria?.nombre,
            header: "CATEGORÍA",
            cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.categoria?.nombre || 'N/A'}</span>
        },
        {
            accessorKey: "stock",
            header: "STOCK",
            cell: ({ row }) => {
                const stock = row.original.stock;
                return (
                    <span className={cn("font-bold text-sm", stock <= 0 ? "text-red-500" : "text-slate-700")}>
                        {stock} un.
                    </span>
                );
            }
        },
        {
            accessorKey: "precioCompra",
            header: "P. COMPRA",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("precioCompra")) || 0;
                return <span className="font-medium text-slate-600">${amount.toLocaleString('es-AR')}</span>
            }
        },
        {
            accessorKey: "precioVenta",
            header: "P. VENTA",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("precioVenta")) || 0;
                return <span className="font-bold text-primary">${amount.toLocaleString('es-AR')}</span>
            }
        },
        {
            id: "estado",
            header: "ESTADO",
            // Agregamos una función acesor para poder filtrar por este estado derivado
            accessorFn: (row) => {
                if (!row.disponible) return "No Disponible";
                if (row.stock <= 0) return "Agotado";
                return "Disponible";
            },
            cell: ({ row }) => {
                const stock = row.original.stock;
                const isDisponible = row.original.disponible;

                let label = "DISPONIBLE";
                let style = "bg-emerald-100 text-emerald-700";
                if (!isDisponible) {
                    label = "NO DISP.";
                    style = "bg-slate-200 text-slate-600";
                } else if (stock <= 0) {
                    label = "AGOTADO";
                    style = "bg-red-100 text-red-700";
                } else if (stock < 10) {
                    label = "POCAS UNID.";
                    style = "bg-amber-100 text-amber-700";
                }

                return <Badge className={cn("text-[10px] px-2 py-0 border-none shadow-none font-semibold", style)}>{label}</Badge>
            }
        },
        {
            id: "acciones",
            header: "",
            cell: ({ row }) => {
                const product = row.original;

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                                    <span className="sr-only">Abrir menú</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(product);
                                }} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Eliminar producto</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            columnFilters
        },
        initialState: {
            pagination: {
                pageSize: pageSize,
            },
        },
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    });

    // Sincronizar filtros externos con el estado de la tabla
    useEffect(() => {
        if (activeCategory && activeCategory !== "all") {
            table.getColumn("categoria_nombre")?.setFilterValue(activeCategory);
        } else {
            table.getColumn("categoria_nombre")?.setFilterValue("");
        }
    }, [activeCategory, table]);

    useEffect(() => {
        if (activeAvailability === "available") {
            table.getColumn("estado")?.setFilterValue("Disponible");
        } else if (activeAvailability === "out_of_stock") {
            table.getColumn("estado")?.setFilterValue("Agotado");
        } else {
            // "all"
            table.getColumn("estado")?.setFilterValue("");
        }
    }, [activeAvailability, table]);


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
                                            className="text-[10px] font-bold py-4 bg-slate-50 first:rounded-tl-xl last:rounded-tr-xl tracking-wider text-slate-500 uppercase"
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
                                    <TableRow key={row.id} className="hover:bg-slate-50 cursor-pointer border-b last:border-0 transition-colors" onClick={() => onEdit(row.original)}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                        No se encontraron productos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </table>
                </div>

                {pagination && (
                    <div className="flex-none flex items-center justify-between px-4 py-3 border-t bg-card rounded-b-xl border-slate-100">
                        <div className="flex-1 text-[13px] text-muted-foreground font-medium">
                            Mostrando {table.getRowModel().rows.length} de {table.getFilteredRowModel().rows.length} producto(s).
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
        </div>
    );
};
