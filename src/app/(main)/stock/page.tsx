"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { StockTable } from "@/components/shared/StockTable";
import { ProductForm } from "@/components/shared/ProductForm";
import { useProducts, useCrearProducto, useActualizarProducto, useEliminarProducto } from "@/hooks/useProducts";
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
    // Hooks de datos
    const { data: products, isLoading: isProductsLoading } = useProducts();
    const { data: categorias } = useCategorias();
    const crearMutation = useCrearProducto();
    const actualizarMutation = useActualizarProducto();
    const eliminarMutation = useEliminarProducto();

    // Estados de filtros
    const [globalFilter, setGlobalFilter] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [activeAvailability, setActiveAvailability] = useState<string>("all");

    // Estados de modales y formulario
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // Handlers
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

    const handleFormSubmit = async (data: Omit<ProductoDTO, 'productoId'>) => {
        try {
            if (selectedProduct) {
                // Actualizar
                await actualizarMutation.mutateAsync({ id: selectedProduct.productoId, producto: data });
            } else {
                // Crear
                await crearMutation.mutateAsync(data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al guardar:", error);
            // Aquí idealmente iría un toast de error
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;
        try {
            await eliminarMutation.mutateAsync(productToDelete.productoId);
            setIsAlertOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <div className="flex h-full flex-row w-full overflow-hidden bg-white">
            <div className="flex w-full flex-col gap-4 p-4 h-full overflow-hidden">
                {/* Cabecera */}
                <div className="flex justify-between items-center px-1">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Gestión de Stock</h1>
                    <Button onClick={handleAddClick} className="shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Añadir Producto
                    </Button>
                </div>

                {/* Filtros */}
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
                    <div className="w-full sm:w-[200px]">
                        <Select value={activeAvailability} onValueChange={setActiveAvailability}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:ring-primary/20 text-slate-600 rounded-xl h-10 px-4 text-[13px] font-medium transition-all">
                                <SelectValue placeholder="Disponibilidad" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl overflow-hidden p-1 min-w-[200px]">
                                <SelectItem value="all" className="text-[13px] font-medium text-slate-600 cursor-pointer">Todos</SelectItem>
                                <SelectItem value="available" className="text-[13px] font-medium text-slate-600 cursor-pointer">Disponibles</SelectItem>
                                <SelectItem value="out_of_stock" className="text-[13px] font-medium text-slate-600 cursor-pointer">Agotados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Contenido Tabla */}
                {isProductsLoading ? (
                    <div className="flex flex-1 justify-center items-center bg-slate-50/50 rounded-xl border border-slate-100">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-sm font-medium text-slate-500">Cargando productos...</p>
                        </div>
                    </div>
                ) : (
                    <StockTable
                        data={products || []}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        activeCategory={activeCategory}
                        activeAvailability={activeAvailability}
                        pagination={true}
                        pageSize={15}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                )}
            </div>

            {/* Modal para Formulario (Crear/Editar) */}
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

            {/* AlertDialog para Eliminar */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
                            <span className="font-bold text-foreground"> {productToDelete?.nombre} </span>
                            (SKU: {productToDelete?.codigo}) de nuestros servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={eliminarMutation.isPending}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Evitamos que cierre directo si queremos esperar la mutation
                                handleConfirmDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                            disabled={eliminarMutation.isPending}
                        >
                            {eliminarMutation.isPending ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
