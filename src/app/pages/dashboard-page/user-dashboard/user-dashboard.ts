import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // Importar Router
import { AuthService } from '../../../services/auth'; // Importar AuthService

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  // Los imports aquí están bien porque SÍ se usan en el TEMPLATE (user-dashboard.html)
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './user-dashboard.html',
  // Reutilizamos estilos del admin dashboard
  styleUrls: ['../../../pages/admin-page/admin-dashboard/admin-dashboard.scss', './user-dashboard.scss']
})
export class UserDashboard {

  constructor(
    public authService: AuthService, // Inyectar AuthService (ya lo tenías)
    private router: Router // Inyectar Router para navegar después del logout
  ) {}

  // Propiedad para obtener el rol (ya la tenías)
  get userRole(): string | null {
    return this.authService.getRole();
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir al login
  }
}
