export interface Categoria {
  categoriaId: number;
  nombre: string;
  descripcion: string;
  activa: boolean;
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