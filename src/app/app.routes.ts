import { Routes } from '@angular/router';
import { Home } from './pages/client-page/home/home';
import { Resenas } from './pages/client-page/resenas/resenas';
import { AdminDashboard } from './pages/admin-page/admin-dashboard/admin-dashboard';
import { ApproveUsers } from './pages/admin-page/approve-users/approve-users';
import { ManageProducts } from './pages/admin-page/manage-products/manage-products';
import { Login } from './authentication/login/login';
import { Register } from './authentication/register/register';
import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin-guard';
import { DejarResena } from './pages/client-page/dejar-resena/dejar-resena';
import { Servicios } from './pages/client-page/servicios/servicios';

// Importamos el nuevo Guardián
import { DistributorGuard } from './core/guards/distributor-guard';

// 1. Importamos el nuevo componente de Layout
import { DistributorDashboard } from './pages/distributor-page/distributor-dashboard/distributor-dashboard';
// 2. Importamos el primer componente funcional del distribuidor
import { DistributorCommissions } from './pages/distributor-page/distributor-commissions/distributor-commissions';


export const routes: Routes = [
  { path: '', component: Home, title: 'Inicio - Plataforma Confianza' },
  { path: 'servicios', component: Servicios, title: 'Nuestros Servicios' },
  { path: 'resenas', component: Resenas, title: 'Reseñas de Clientes' },
  { path: 'escribir-resena', component: DejarResena, canActivate: [AuthGuard], title: 'Dejar una Reseña' },
  { path: 'login', component: Login, title: 'Iniciar Sesión' },
  { path: 'register', component: Register, title: 'Registro de Usuario' },
  
  // --- RUTAS DE DISTRIBUIDOR (PROTEGIDAS) ---
  {
    path: 'distribuidor',
    component: DistributorDashboard, // Layout principal
    canActivate: [DistributorGuard], // ¡Protegido por el nuevo Guard!
    title: 'Panel de Distribuidor',
    children: [
      {
        path: 'comisiones',
        component: DistributorCommissions,
        title: 'Distribuidor | Comisiones'
      },
      // Redirección por defecto si solo acceden a /distribuidor
      {
        path: '',
        redirectTo: 'comisiones',
        pathMatch: 'full'
      }
    ]
  },

  // --- RUTAS DE ADMINISTRADOR (PROTEGIDAS) ---
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [AdminGuard],
    title: 'Panel de Administración',
    children: [
      { path: 'usuarios', component: ApproveUsers, title: 'Admin | Aprobar Usuarios' },
      { path: 'productos', component: ManageProducts, title: 'Admin | Gestionar Productos' },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },
  
  // --- Ruta Wildcard ---
  { path: '**', redirectTo: '', pathMatch: 'full' }
];