// src/app/shared/dialogs/pedido-dialog/pedido-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// Importa tu modelo/DTO de Producto si lo tienes para mostrar el nombre
// import { Producto } from '../../../models/producto.models';

@Component({
  selector: 'app-pedido-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './pedido-dialog.html',
  styleUrls: ['./pedido-dialog.scss'] // Corregido
})
export class PedidoDialog {
  pedidoForm: FormGroup;
  productoNombre: string; // Para mostrar el nombre del producto

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PedidoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { productoId: number; productoNombre: string } // Recibe ID y nombre del producto
  ) {
    this.productoNombre = data.productoNombre;
    this.pedidoForm = this.fb.group({
      nombreCliente: ['', Validators.required],
      emailCliente: ['', [Validators.required, Validators.email]],
      whatsappCliente: ['', Validators.required],
      // idProducto se tomará de 'data.productoId' al enviar
    });
  }

  onSave(): void {
    if (this.pedidoForm.valid) {
      // Combinamos los datos del form con el idProducto recibido
      const pedidoData = {
        ...this.pedidoForm.value,
        idProducto: this.data.productoId
      };
      this.dialogRef.close(pedidoData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}