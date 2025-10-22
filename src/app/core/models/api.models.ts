export interface LoginResponse {
  token: string;
  mensaje: string;
  rol: string;
}

export interface RegistroPayload {
  nombre: string;
  email: string;
  password: string;
  whatsapp: string;
  codigoReferenciaUsado?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface PedidoPayload {
  nombreCliente: string;
  emailCliente: string;
  whatsappCliente: string;
  idProducto: number;
}