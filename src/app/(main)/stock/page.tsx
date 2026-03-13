"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { ProductTable } from "@/components/shared/ProductsTable";
import { ProductForm } from "@/components/shared/ProductForm";
import { useProducts, useProductosDeshabilitados, useCrearProducto, useActualizarProducto, useEliminarProducto, useHabilitarProducto } from "@/hooks/useProducts";
import { useCategorias } from "@/hooks/useCategorias";
import { Product, ProductoDTO } from "@/types/product.types";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GenericModal } from "@/components/shared/GenericModal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StockPage() {
    const { data: productsActivos, isLoading: isProductsLoading } = useProducts();
    const { data: productsDeshabilitados, isLoading: isDeshabilitadosLoading } = useProductosDeshabilitados();
    const { data: categorias } = useCategorias();
    const crearMutation = useCrearProducto();
    const actualizarMutation = useActualizarProducto();
    const eliminarMutation = useEliminarProducto();
    const habilitarMutation = useHabilitarProducto();

    const [globalFilter, setGlobalFilter] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activeAvailability, setActiveAvailability] = useState<string>("all");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const [isRestoreAlertOpen, setIsRestoreAlertOpen] = useState(false);
    const [productToRestore, setProductToRestore] = useState<Product | null>(null);

    const handleAddClick = () => {
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setIsAlertOpen(true);
    };

    const handleRestoreClick = (product: Product) => {
        setProductToRestore(product);
        setIsRestoreAlertOpen(true);
    };

    const handleFormSubmit = async (data: Omit<ProductoDTO, 'productoId'>) => {
        try {
            if (selectedProduct) {
                await actualizarMutation.mutateAsync({ id: selectedProduct.productoId, producto: data });
            } else {
                await crearMutation.mutateAsync(data);
            }
            setIsModalOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || "Ocurrió un error al guardar el producto.");
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await eliminarMutation.mutateAsync(productToDelete.productoId);
            setIsAlertOpen(false);
            setProductToDelete(null);
        } catch (error: any) {
            alert(error.response?.data?.message || "Ocurrió un error al deshabilitar el producto.");
        }
    };

    const handleConfirmRestore = async () => {
        if (!productToRestore) return;
        try {
            await habilitarMutation.mutateAsync(productToRestore.productoId);
            setIsRestoreAlertOpen(false);
            setProductToRestore(null);
        } catch (error: any) {
            alert(error.response?.data?.message || "Ocurrió un error al restaurar el producto.");
        }
    };

    const allProducts = [
        ...(productsActivos || []),
        ...(productsDeshabilitados || [])
    ];

    const currentLoading = isProductsLoading || isDeshabilitadosLoading;

    return (
        <div className="flex h-full flex-row w-full overflow-hidden bg-white">
            <div className="flex w-full flex-col gap-4 p-4 h-full overflow-hidden">
                <div className="flex items-center justify-between px-1 relative min-h-[40px]">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800 absolute left-1/2 -translate-x-1/2 w-max">Gestión de Stock</h1>
                    <div className="flex-1"></div>
                    <Button onClick={handleAddClick} className="shadow-sm relative z-10">
                        <Plus className="mr-2 h-4 w-4" /> Añadir Producto
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <div className="flex-1">
                        <SearchBar value={globalFilter} onChange={setGlobalFilter} />
                    </div>
                    <div className="w-full sm:w-[200px]">
                        <Select value={activeCategory} onValueChange={setActiveCategory}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-primary/20 text-slate-600 rounded-xl h-10 px-4 text-[13px] font-medium transition-all">
                                <SelectValue placeholder="Todas las categorías" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl overflow-hidden p-1 min-w-[200px]">
                                <SelectItem value="all" className="text-[13px] font-medium text-slate-600 cursor-pointer">Todas las categorías</SelectItem>
                                {categorias?.map((cat) => (
                                    <SelectItem key={cat.categoriaId} value={cat.nombre} className="text-[13px] font-medium text-slate-600 cursor-pointer">
                                        {cat.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full sm:w-[250px]">
                        <Select value={activeAvailability} onValueChange={setActiveAvailability}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-primary/20 text-slate-600 rounded-xl h-10 px-4 text-[13px] font-medium transition-all">
                                <SelectValue placeholder="Estado y Disponibilidad" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl overflow-hidden p-1 min-w-[250px]">
                                <SelectItem value="all" className="text-[13px] font-medium text-slate-600 cursor-pointer">Todos los productos</SelectItem>
                                <SelectItem value="activo" className="text-[13px] font-medium text-slate-600 cursor-pointer">Con Stock (Activos)</SelectItem>
                                <SelectItem value="agotado" className="text-[13px] font-medium text-slate-600 cursor-pointer">Agotados (Sin Stock)</SelectItem>
                                <SelectItem value="habilitado" className="text-[13px] font-medium text-slate-600 cursor-pointer">Habilitados</SelectItem>
                                <SelectItem value="deshabilitado" className="text-[13px] font-medium text-slate-600 cursor-pointer">Deshabilitados (Papelera)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {currentLoading ? (
                    <div className="flex flex-1 justify-center items-center bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-500">Cargando productos...</p>
                        </div>
                    </div>
                ) : (
                    <ProductTable
                        data={allProducts}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        activeCategory={activeCategory}
                        activeAvailability={activeAvailability}
                        pagination={true}
                        pageSize={100}
                        visibleColumns={{
                            categoria: true,
                            precioVenta: true,
                            precioCompra: true,
                            stock: true,
                            estado: true,
                            disponibilidad: true,
                            acciones: true
                        }}
                        onRowClick={(product) => {
                            if (product.habilitado) {
                                handleEditClick(product);
                            }
                        }}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onRestore={handleRestoreClick}
                    />
                )}
            </div>

            <GenericModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedProduct ? "Editar Producto" : "Nuevo Producto"}
                description={selectedProduct
                    ? "Modifica los detalles del producto seleccionado."
                    : "Ingresa los datos para registrar un nuevo producto en el inventario."}
            >
                <div className="pt-2">
                    <ProductForm
                        initialData={selectedProduct}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setIsModalOpen(false)}
                        isLoading={crearMutation.isPending || actualizarMutation.isPending}
                    />
                </div>
            </GenericModal>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción deshabilitará el producto
                            <span className="font-bold text-foreground"> {productToDelete?.nombre} </span>
                            (SKU: {productToDelete?.codigo}). Se enviará a la papelera y dejará de estar disponible en el sistema de ventas.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={eliminarMutation.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={eliminarMutation.isPending}
                        >
                            {eliminarMutation.isPending ? "Deshabilitando..." : "Deshabilitar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={isRestoreAlertOpen} onOpenChange={setIsRestoreAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Restaurar producto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            El producto
                            <span className="font-bold text-foreground"> {productToRestore?.nombre} </span>
                            (SKU: {productToRestore?.codigo}) volverá a estar activo y disponible en el sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={habilitarMutation.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleConfirmRestore();
                            }}
                            className="bg-green-600 hover:bg-green-700 focus:ring-green-600"
                            disabled={habilitarMutation.isPending}
                        >
                            {habilitarMutation.isPending ? "Restaurando..." : "Restaurar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}