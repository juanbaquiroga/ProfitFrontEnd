export interface Categoria {
  categoriaId: number;
  nombre: string;
  descripcion: string;
  activa?: boolean;
}

export interface Product {
  productoId: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  stock: number;
  proveedor: string;
  precioCompra: number;
  precioVenta: number;
  categoria: Categoria;
}

export interface CategoriaDTO {

  categoriaId: number;
  nombre: string;
  descripcion: string;
  activa?: boolean;
}

export interface ProductoDTO {
  productoId?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  disponible: boolean;
  stock: number;
  proveedor: string;
  precioCompra: number;
  precioVenta: number;
  categoriaId: number;
  categoriaNombre?: string;
}