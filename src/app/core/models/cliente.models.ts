export interface DashboardSummary {
  totalComprasCompletadas: number; // En frontend será number, el backend envía BigDecimal
  // Añadir otros campos si el backend los devuelve en el futuro
  // saldoActual?: number;
  // totalReferidos?: number;
}