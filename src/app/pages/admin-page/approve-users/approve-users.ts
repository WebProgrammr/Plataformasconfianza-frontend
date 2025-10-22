import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin';
import { Usuario } from '../../../core/models/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-approve-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-users.html',
  styleUrls: ['./approve-users.scss']
})
export class ApproveUsers implements OnInit {

  usuariosPendientes: Usuario[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.adminService.getUsuariosPendientes().subscribe({
      next: (data: Usuario[]) => {
        this.usuariosPendientes = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'No se pudieron cargar los usuarios pendientes.';
        this.isLoading = false;
      }
    });
  }

  aprobarUsuario(id: number): void {
    this.errorMessage = null;
    this.successMessage = null;

    this.adminService.aprobarUsuario(id).subscribe({
      next: (usuarioAprobado: Usuario) => {
        this.successMessage = `Usuario "${usuarioAprobado.nombre}" ha sido aprobado.`;
        // Recargamos la lista para quitar al usuario aprobado
        this.cargarUsuarios();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Error al aprobar el usuario.';
      }
    });
  }
}