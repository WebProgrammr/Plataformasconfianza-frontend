export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  idAdminPublicador: number;
  fechaPublicacion: string;
}

export interface SaveProducto {
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
}