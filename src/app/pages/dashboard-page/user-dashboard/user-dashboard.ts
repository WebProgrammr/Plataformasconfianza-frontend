import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-dashboard.html',
  // Reutilizamos estilos del admin dashboard, pero podrías crear unos nuevos
  styleUrls: ['../../../pages/admin-page/admin-dashboard/admin-dashboard.scss', './user-dashboard.scss']
})
export class UserDashboard {
  // Inyectamos AuthService para obtener el rol
  constructor(public authService: AuthService) {}

  // Podríamos tener una función para obtener el rol si es necesario
  get userRole(): string | null {
    return this.authService.getRole();
  }
}