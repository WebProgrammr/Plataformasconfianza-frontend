export interface Pedido {
  id: number;
  nombreCliente: string;
  emailCliente: string;
  whatsappCliente: string;
  idUsuario: number | null;
  idProducto: number;
  estado: string;
  fechaPedido: string;
}