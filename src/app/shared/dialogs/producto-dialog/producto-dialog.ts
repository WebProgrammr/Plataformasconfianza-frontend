// src/app/shared/dialogs/producto-dialog/producto-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para formularios reactivos
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// Importa tu modelo/DTO de Producto si lo tienes
// import { Producto } from '../../../models/producto.models';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Importante para formularios
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './producto-dialog.html',
  styleUrls: ['./producto-dialog.scss'] // Corregido a styleUrls
})
export class ProductoDialog {
  productoForm: FormGroup;
  isEditMode: boolean;

  // Inyectamos FormBuilder, MatDialogRef y MAT_DIALOG_DATA
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any // 'any' temporalmente, idealmente sería tu modelo Producto o null
  ) {
    // Verificamos si estamos editando (si recibimos datos)
    this.isEditMode = !!data;

    // Creamos el formulario reactivo
    this.productoForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required], // Valor inicial y validación
      descripcion: [data?.descripcion || ''],
      precio: [data?.precio || 0, [Validators.required, Validators.min(0)]],
      imagenUrl: [data?.imagenUrl || '']
      // Añade más campos si tu modelo Producto los tiene
    });
  }

  // Método al guardar
  onSave(): void {
    if (this.productoForm.valid) {
      // Devolvemos los datos del formulario al componente que abrió el diálogo
      this.dialogRef.close(this.productoForm.value);
    }
  }

  // Método al cancelar
  onCancel(): void {
    this.dialogRef.close(); // Cerramos sin devolver datos
  }
}