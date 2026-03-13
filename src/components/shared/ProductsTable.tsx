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
import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProductTableProps {
  data: Product[];
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  activeCategory?: string;
  activeAvailability?: string;
  pagination?: boolean;
  pageSize?: number;
  visibleColumns?: {
    categoria?: boolean;
    precioVenta?: boolean;
    precioCompra?: boolean;
    estado?: boolean;
    disponibilidad?: boolean;
    stock?: boolean;
    acciones?: boolean;
  };
  onRowClick?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onRestore?: (product: Product) => void;
}

export const ProductTable = ({
  data,
  globalFilter,
  setGlobalFilter,
  activeCategory,
  activeAvailability,
  pagination = false,
  pageSize = 10,
  visibleColumns = { categoria: true, precioVenta: true, estado: true, disponibilidad: true },
  onRowClick,
  onEdit,
  onDelete,
  onRestore
}: ProductTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<Product>[]>(() => {
    const baseCols: ColumnDef<Product>[] = [
      {
        accessorKey: "codigo",
        header: "SKU",
        cell: ({ row }) => <span className="text-muted-foreground text-[10px] uppercase font-mono font-bold tracking-wider">{row.getValue("codigo")}</span>
      },
      {
        accessorKey: "nombre",
        header: "PRODUCTO",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-primary">{row.getValue("nombre")}</span>
            <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">
              {row.original.descripcion}
            </span>
          </div>
        )
      },
    ];

    if (visibleColumns.categoria) {
      baseCols.push({
        id: "categoria_nombre",
        accessorFn: (row) => row.categoria?.nombre,
        header: "CATEGORÍA",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.categoria?.nombre || 'N/A'}</span>
      });
    }

    if (visibleColumns.stock) {
      baseCols.push({
        accessorKey: "stock",
        header: "STOCK",
        cell: ({ row }) => (
          <span className={cn("font-bold text-sm", row.original.stock <= 0 ? "text-red-500" : "text-slate-700")}>
            {row.original.stock} un.
          </span>
        )
      });
    }

    if (visibleColumns.precioCompra) {
      baseCols.push({
        accessorKey: "precioCompra",
        header: "P. COMPRA",
        cell: ({ row }) => <span className="font-medium text-slate-600">${(parseFloat(row.getValue("precioCompra")) || 0).toLocaleString('es-AR')}</span>
      });
    }

    if (visibleColumns.precioVenta) {
      baseCols.push({
        accessorKey: "precioVenta",
        header: "P. VENTA",
        cell: ({ row }) => <span className="font-bold text-primary">${(parseFloat(row.getValue("precioVenta")) || 0).toLocaleString('es-AR')}</span>
      });
    }

    if (visibleColumns.estado) {
      baseCols.push({
        id: "estado_stock",
        header: "ESTADO",
        accessorFn: (row) => row.stock > 0 ? "Activo" : "Agotado",
        cell: ({ row }) => {
          const stock = row.original.stock;
          let label = "ACTIVO";
          let style = "bg-green-100 text-green-700";
          if (stock <= 0) {
            label = "AGOTADO";
            style = "bg-red-100 text-red-700";
          } else if (stock < 10) {
            label = "POCAS UNID.";
            style = "bg-yellow-100 text-yellow-700";
          }
          return <Badge className={cn("text-[10px] px-2 py-0 border-none shadow-none font-semibold", style)}>{label}</Badge>
        }
      });
    }

    if (visibleColumns.disponibilidad) {
      baseCols.push({
        id: "disponibilidad_status",
        header: "DISPONIBILIDAD",
        accessorFn: (row) => row.habilitado ? "ESTADO_HABILITADO" : "ESTADO_DESHABILITADO",
        cell: ({ row }) => {
          const isHabilitado = row.original.habilitado;
          let label = isHabilitado ? "HABILITADO" : "DESHABILITADO";
          let style = isHabilitado ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600";

          return <Badge className={cn("text-[10px] px-2 py-0 border-none shadow-none font-semibold", style)}>{label}</Badge>
        }
      });
    }

    if (visibleColumns.acciones && (onEdit || onDelete || onRestore)) {
      baseCols.push({
        id: "acciones",
        header: "",
        cell: ({ row }) => (
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
                {!row.original.habilitado && onRestore && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onRestore(row.original);
                  }} className="cursor-pointer text-green-600 focus:text-green-600 focus:bg-green-50">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    <span>Restaurar producto</span>
                  </DropdownMenuItem>
                )}
                {row.original.habilitado && onDelete && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row.original);
                  }} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Deshabilitar producto</span>
                  </DropdownMenuItem>
                )}
                {row.original.habilitado && onEdit && (
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row.original);
                  }} className="cursor-pointer text-primary focus:text-primary focus:bg-profit/20">
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Editar producto</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      });
    }

    return baseCols;
  }, [visibleColumns, onEdit, onDelete, onRestore]);

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
    const catCol = table.getAllColumns().find(c => c.id === "categoria_nombre");
    if (catCol) {
      if (activeCategory && activeCategory !== "all") {
        catCol.setFilterValue(activeCategory);
      } else {
        catCol.setFilterValue("");
      }
    }
  }, [activeCategory, table]);

  useEffect(() => {
    const estadoCol = table.getAllColumns().find(c => c.id === "estado_stock");
    const dispCol = table.getAllColumns().find(c => c.id === "disponibilidad_status");

    if (estadoCol) estadoCol.setFilterValue("");
    if (dispCol) dispCol.setFilterValue("");

    if (activeAvailability === "activo" && estadoCol) {
      estadoCol.setFilterValue("Activo");
    } else if (activeAvailability === "agotado" && estadoCol) {
      estadoCol.setFilterValue("Agotado");
    } else if (activeAvailability === "habilitado" && dispCol) {
      dispCol.setFilterValue("ESTADO_HABILITADO");
    } else if (activeAvailability === "deshabilitado" && dispCol) {
      dispCol.setFilterValue("ESTADO_DESHABILITADO");
    }
  }, [activeAvailability, table]);

  return (
    <div className="w-full h-full relative flex flex-col min-h-0 rounded-2xl shadow-xl border border-border overflow-hidden bg-card">
      <div className="flex-1 overflow-auto">
        <table className="w-full caption-bottom text-sm relative border-separate border-spacing-0">
          <TableHeader className="sticky top-0 z-20">
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
              <TableRow
                key={row.id}
                onClick={() => onRowClick && onRowClick(row.original)}
                className="hover:bg-slate-50 border-b last:border-0 cursor-pointer transition-colors"
              >
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
      {pagination && (
        <div className="flex-none flex items-center justify-between px-4 py-3 border-t bg-card rounded-b-xl border-border">
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
  );
};