import { Routes } from '@angular/router';
// ... otros imports ...
import { Home } from './pages/client-page/home/home';
import { Servicios } from './pages/client-page/servicios/servicios';
import { Resenas } from './pages/client-page/resenas/resenas';
import { Login } from './authentication/login/login';
import { Register } from './authentication/register/register';
import { DejarResena } from './pages/client-page/dejar-resena/dejar-resena';

import { UserDashboard } from './pages/dashboard-page/user-dashboard/user-dashboard';
import { DashboardHome } from './pages/dashboard-page/dashboard-home/dashboard-home';
import { RecargaSaldo } from './pages/dashboard-page/recarga-saldo/recarga-saldo';
import { MisPedidos } from './pages/dashboard-page/mis-pedidos/mis-pedidos';

import { AdminDashboard } from './pages/admin-page/admin-dashboard/admin-dashboard';
import { ApproveUsers } from './pages/admin-page/approve-users/approve-users';
import { ManageProducts } from './pages/admin-page/manage-products/manage-products';
import { ApproveRecargas } from './pages/admin-page/approve-recargas/approve-recargas'; // <-- ASEGÚRATE QUE ESTE IMPORT ESTÉ CORRECTO
import { ManagePedidos } from './pages/admin-page/manage-pedidos/manage-pedidos';

import { AuthGuard } from './core/guards/auth-guard';
import { AdminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // --- Rutas Públicas ---
  { path: '', component: Home, title: 'Inicio - Plataforma Confianza' },
  { path: 'servicios', component: Servicios, title: 'Nuestros Servicios' },
  { path: 'resenas', component: Resenas, title: 'Reseñas de Clientes' },
  { path: 'login', component: Login, title: 'Iniciar Sesión' },
  { path: 'register', component: Register, title: 'Registro de Usuario' },

  // --- Rutas Protegidas (Requieren Login) ---
  { path: 'escribir-resena', component: DejarResena, canActivate: [AuthGuard], title: 'Dejar una Reseña' },

  // --- PANEL DE CONTROL UNIFICADO ---
  {
    path: 'dashboard',
    component: UserDashboard, // Layout
    canActivate: [AuthGuard],
    title: 'Mi Panel',
    children: [
      { path: '', component: DashboardHome, title: 'Dashboard' },
      { path: 'recarga', component: RecargaSaldo, title: 'Recargar Saldo' },
      { path: 'pedidos', component: MisPedidos, title: 'Mis Pedidos' },
      // Aquí podrían ir rutas específicas de distribuidor si las hubiera
    ]
  },

  // --- Rutas de Administrador (Protegidas por AdminGuard) ---
  {
    path: 'admin',
    component: AdminDashboard, // Layout Admin
    canActivate: [AdminGuard],
    title: 'Panel de Administración',
    children: [
      { path: 'usuarios', component: ApproveUsers, title: 'Admin | Aprobar Usuarios' },
      { path: 'productos', component: ManageProducts, title: 'Admin | Gestionar Productos' },
      // **** ASEGÚRATE QUE ESTA LÍNEA ESTÉ AQUÍ ****
      { path: 'recargas', component: ApproveRecargas, title: 'Admin | Aprobar Recargas' },
      { path: 'pedidos', component: ManagePedidos, title: 'Admin | Gestionar Pedidos' },
      // **** FIN VERIFICACIÓN ****
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' } // Redirige /admin a /admin/usuarios
    ]
  },

  // --- Ruta Wildcard (Al final) ---
  { path: '**', redirectTo: '', pathMatch: 'full' }
];