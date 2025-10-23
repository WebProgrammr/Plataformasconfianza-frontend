import { Component, OnInit } from '@angular/core'; // <-- Añadir OnInit
import { CommonModule, CurrencyPipe } from '@angular/common'; // <-- Añadir CurrencyPipe
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { PedidoService } from '../../../services/pedido'; // <-- Importar PedidoService
import { DashboardSummary } from '../../../core/models/api.models'; // <-- Importar DTO
import { HttpErrorResponse } from '@angular/common/http'; // <-- Importar HttpErrorResponse

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe // <-- Añadir CurrencyPipe
    ],
  templateUrl: './dashboard-home.html',
  styleUrls: ['./dashboard-home.scss']
})
export class DashboardHome implements OnInit { // <-- Implementar OnInit

  // Variables para guardar los datos del resumen
  summaryData: DashboardSummary | null = null;
  isLoading = true; // Indicador de carga
  errorMessage: string | null = null; // Mensaje de error

  constructor(
    public authService: AuthService,
    private pedidoService: PedidoService // <-- Inyectar PedidoService
    ) {}

  ngOnInit(): void {
    this.cargarResumen(); // Llamar al método al iniciar
  }

  cargarResumen(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.pedidoService.getDashboardSummary().subscribe({
      next: (data: DashboardSummary) => {
        this.summaryData = data;
        this.isLoading = false;
        console.log('Resumen del dashboard cargado:', this.summaryData);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar resumen del dashboard:', err);
        this.errorMessage = 'No se pudo cargar el resumen. Intenta más tarde.';
         if (err.status === 401) {
             this.errorMessage = 'No autorizado. Por favor, inicia sesión de nuevo.';
         }
        this.isLoading = false;
      }
    });
  }
}