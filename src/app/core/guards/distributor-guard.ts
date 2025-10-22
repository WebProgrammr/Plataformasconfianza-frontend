import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Injectable({
  providedIn: 'root'
})
export class DistributorGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getRole();

    if (isLoggedIn && userRole === 'DISTRIBUIDOR') {
      return true; // Es un Distribuidor, puede pasar
    } else {
      // Si no es distribuidor (o no está logueado), lo mandamos al inicio
      this.router.navigate(['/']);
      return false;
    }
  }
}