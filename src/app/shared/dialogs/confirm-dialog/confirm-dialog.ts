// src/app/shared/dialogs/confirm-dialog/confirm-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog.html',
  styleUrls: ['./confirm-dialog.scss'] // Corregido
})
export class ConfirmDialog {
  title: string;
  message: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {
    // Asignamos título y mensaje desde los datos inyectados
    this.title = data.title || 'Confirmación';
    this.message = data.message || '¿Estás seguro?';
  }

  onConfirm(): void {
    // Cerramos devolviendo 'true' para indicar confirmación
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Cerramos devolviendo 'false' o nada para indicar cancelación
    this.dialogRef.close(false);
  }
}