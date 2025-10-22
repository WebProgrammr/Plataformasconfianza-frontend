import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-distributor-commissions',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe
  ],
  templateUrl: './distributor-commissions.html',
  styleUrls: ['../../../pages/admin-page/approve-users/approve-users.scss'] // Reutilizamos estilos de tabla
})
export class DistributorCommissions {

  comisiones: any[] = [
    { fecha: '2025-10-15', servicio: 'Netflix Premium', monto: 3.50, estado: 'Pagado' },
    { fecha: '2025-10-18', servicio: 'Office 365', monto: 5.00, estado: 'Pendiente' },
    { fecha: '2025-10-21', servicio: 'Spotify Familiar', monto: 1.25, estado: 'Pagado' }
  ];

  totalComisiones = 9.75;
}