import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-producto-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './producto-dialog.html',
  styleUrls: ['./producto-dialog.scss']
})
export class ProductoDialog {
  productoForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Producto | null
  ) {
    this.isEditMode = !!data;

    this.productoForm = this.fb.group({
      nombre: [data?.nombre || '', [Validators.required, Validators.maxLength(100)]],
      descripcion: [data?.descripcion || '', [Validators.maxLength(500)]],
      precio: [data?.precio || null, [Validators.required, Validators.min(0.01)]],
      imagenUrl: [data?.imagenUrl || '', [Validators.maxLength(255)]]
    });
  }

  onSave(): void {
    if (this.productoForm.valid) {
      this.dialogRef.close(this.productoForm.value);
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}