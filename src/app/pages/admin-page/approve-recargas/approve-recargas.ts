import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common'; // Pipes necesarios
import { AdminService } from '../../../services/admin'; // Importar AdminService
import { Recarga } from '../../../core/models/recarga.model'; // Importar modelo Recarga
import { HttpErrorResponse } from '@angular/common/http';
// Opcional: Importar FormsModule si usamos [(ngModel)] para el motivo de rechazo
// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approve-recargas',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CurrencyPipe,
    // FormsModule // Añadir si usas [(ngModel)]
    ],
  templateUrl: './approve-recargas.html',
  styleUrls: ['./approve-recargas.scss']
})
export class ApproveRecargas implements OnInit {

  recargasPendientes: Recarga[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarRecargas();
  }

  cargarRecargas(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null; // Limpiar mensajes al recargar
    this.adminService.getRecargasPendientes().subscribe({
      next: (data: Recarga[]) => {
        this.recargasPendientes = data;
        this.isLoading = false;
        console.log('Recargas pendientes:', this.recargasPendientes);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar recargas pendientes:', err);
        this.errorMessage = 'No se pudieron cargar las recargas pendientes.';
        this.isLoading = false;
      }
    });
  }

  aprobar(recarga: Recarga): void {
    // Limpiar mensajes
    this.errorMessage = null;
    this.successMessage = null;
    console.log(`Intentando aprobar recarga ID: ${recarga.id}`);


    this.adminService.aprobarRecarga(recarga.id).subscribe({
      next: (recargaAprobada) => {
        this.successMessage = `Recarga de S/ ${recarga.monto} para usuario ID ${recarga.idUsuario} aprobada exitosamente.`;
        this.cargarRecargas(); // Recargar la lista para quitar la aprobada
        console.log('Recarga aprobada:', recargaAprobada);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al aprobar recarga:', err);
        this.errorMessage = `Error al aprobar recarga: ${err.error?.message || err.message || 'Error desconocido'}`;
      }
    });
  }

  rechazar(recarga: Recarga): void {
    // Limpiar mensajes
    this.errorMessage = null;
    this.successMessage = null;
    console.log(`Intentando rechazar recarga ID: ${recarga.id}`);

    // Pedir motivo al administrador (simple prompt por ahora)
    const motivo = prompt(`Ingresa el motivo para rechazar la recarga de S/ ${recarga.monto} (Usuario ID: ${recarga.idUsuario}):`);

    // Si el usuario cancela el prompt, motivo será null, lo cual está bien
    // Si no ingresa nada, será "", también está bien

    this.adminService.rechazarRecarga(recarga.id, motivo).subscribe({
      next: (recargaRechazada) => {
        this.successMessage = `Recarga de S/ ${recarga.monto} para usuario ID ${recarga.idUsuario} rechazada exitosamente.`;
        this.cargarRecargas(); // Recargar la lista para quitar la rechazada
        console.log('Recarga rechazada:', recargaRechazada);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al rechazar recarga:', err);
        this.errorMessage = `Error al rechazar recarga: ${err.error?.message || err.message || 'Error desconocido'}`;
      }
    });
  }

   // Helper para abrir enlace en nueva pestaña (si hay comprobante)
   verComprobante(url?: string): void {
      if (url) {
         window.open(url, '_blank');
      }
   }
}