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
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  data: Product[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  activeCategory: string | undefined;
  pagination?: boolean;
  pageSize?: number;
}

export const ProductTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  activeCategory,
  pagination = false,
  pageSize = 10
}: ProductTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "codigo", // Antes era 'sku'
      header: "SKU",
      cell: ({ row }) => <span className="text-muted-foreground text-[10px] uppercase font-mono">{row.getValue("codigo")}</span>
    },
    {
      accessorKey: "nombre",
      header: "NOMBRE DEL PRODUCTO",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{row.getValue("nombre")}</span>
          <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
            {row.original.descripcion}
          </span>
        </div>
      )
    },
    {
      accessorKey: "categoria.nombre", // Acceso a objeto anidado
      header: "CATEGORÍA",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.categoria.nombre}</span>
    },
    {
      accessorKey: "precioVenta", // Antes era 'price'
      header: "PRECIO",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("precioVenta"));
        return <span className="font-bold text-primary">${amount.toLocaleString('es-AR')}</span>
      }
    },
    {
      id: "disponibilidad",
      header: "DISPONIBILIDAD",
      cell: ({ row }) => {
        const stock = row.original.stock;
        const isDisponible = row.original.disponible;

        let label = "DISPONIBLE";
        let style = "bg-green-100 text-green-700";
        if (!isDisponible) {
          label = "NO DISPONIBLE";
          style = "bg-red-100 text-red-700";
        } else if (isDisponible && stock <= 0) {
          label = "AGOTADO";
          style = "bg-red-100 text-red-700";
        } else if (isDisponible && stock < 10) {
          label = "POCAS UNID.";
          style = "bg-yellow-100 text-yellow-700";
        }

        return <Badge className={cn("text-[10px] px-2 py-0 border-none shadow-none", style)}>{label}</Badge>
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

  useEffect(() => {
    table.getColumn("categoria_nombre")?.setFilterValue(activeCategory);
  }, [activeCategory, table]);

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Container Principal */}
      <div className="rounded-xl border bg-card flex flex-col min-h-0 relative flex-1">

        {/* Zona Scrolleable (Aquí ocurre la magia del alto) */}
        <div className="flex-1 overflow-auto">
          <table className="w-full caption-bottom text-sm relative border-separate border-spacing-0">
            {/* Header Sticky */}
            <TableHeader className="sticky top-0 z-20 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-none">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-[10px] font-bold py-4 bg-slate-50 first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} onClick={() => console.log(row.original)} className="hover:bg-green-100 border-b last:border-0 cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </table>
        </div>

        {/* Footer de Paginación Condicional Fijo (Fuera del Scroll) */}
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