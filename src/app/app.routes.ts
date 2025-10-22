// src/app/app.routes.ts
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

// --- NUEVOS IMPORTS ---
import { UserDashboard } from './pages/dashboard-page/user-dashboard/user-dashboard'; // Layout principal del dashboard
import { DashboardHome } from './pages/dashboard-page/dashboard-home/dashboard-home'; // Vista principal del dashboard
import { RecargaSaldo } from './pages/dashboard-page/recarga-saldo/recarga-saldo'; // Componente de recarga

// Ya no necesitamos DistributorGuard ni los componentes de distribuidor
// import { DistributorGuard } from './core/guards/distributor-guard';
// import { DistributorDashboard } from './pages/distributor-page/distributor-dashboard/distributor-dashboard';
// import { DistributorCommissions } from './pages/distributor-page/distributor-commissions/distributor-commissions';


export const routes: Routes = [
  // --- Rutas Públicas ---
  { path: '', component: Home, title: 'Inicio - Plataforma Confianza' },
  { path: 'servicios', component: Servicios, title: 'Nuestros Servicios' },
  { path: 'resenas', component: Resenas, title: 'Reseñas de Clientes' },
  { path: 'login', component: Login, title: 'Iniciar Sesión' },
  { path: 'register', component: Register, title: 'Registro de Usuario' },

  // --- Rutas Protegidas (Requieren Login) ---
  { path: 'escribir-resena', component: DejarResena, canActivate: [AuthGuard], title: 'Dejar una Reseña' },

  // --- NUEVO PANEL DE CONTROL UNIFICADO ---
  {
    path: 'dashboard',
    component: UserDashboard, // Carga el layout del dashboard
    canActivate: [AuthGuard], // Protegido por login general
    title: 'Mi Panel',
    children: [
      { path: '', component: DashboardHome, title: 'Dashboard' }, // Ruta por defecto (/dashboard)
      { path: 'recarga', component: RecargaSaldo, title: 'Recargar Saldo' },
      // --- Placeholder para futuras rutas ---
      // { path: 'pedidos', component: MisPedidos, title: 'Mis Pedidos' },
      // { path: 'productos', component: GestionProductosDist, canActivate: [DistributorGuard], title: 'Gestionar Productos (Dist)' }, // Ejemplo ruta solo para distribuidor
    ]
  },

  // --- Rutas de Administrador (Protegidas por AdminGuard) ---
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

  // --- Ruta Wildcard (Al final) ---
  { path: '**', redirectTo: '', pathMatch: 'full' }
];