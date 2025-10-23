export interface Recarga {
  id: number;
  idUsuario: number;
  monto: number; // Angular manejará BigDecimal como number
  metodoPago: string;
  estado: string;
  comprobanteUrl?: string; // Puede ser opcional/nulo
  nota?: string; // Puede ser opcional/nulo
  fechaSolicitud: string; // Angular manejará Instant como string (ISO date)
  fechaProcesamiento?: string; // Puede ser opcional/nulo
  procesadoPorAdmin?: number; // Puede ser opcional/nulo

  // Opcional: Podríamos añadir campos extra si hacemos un JOIN en el backend
  // emailUsuario?: string;
  // nombreUsuario?: string;
}

// Opcional: DTO para el cuerpo de la petición de rechazo
export interface RechazarRecargaPayload {
  motivo: string;
}