import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ResenaService } from '../../../services/resena';
import { SaveResena } from '../../../core/models/resena.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dejar-resena',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './dejar-resena.html',
  styleUrls: ['./dejar-resena.scss']
})
export class DejarResena implements OnInit {

  resenaForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private resenaService: ResenaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resenaForm = this.fb.group({
      calificacion: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.resenaForm.invalid) {
      this.resenaForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.successMessage = null;
    const payload: SaveResena = this.resenaForm.value;

    this.resenaService.crearResena(payload).subscribe({
      next: () => {
        this.successMessage = '¡Gracias por tu reseña! Serás redirigido...';
        setTimeout(() => {
          this.router.navigate(['/resenas']);
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.errorMessage = 'Debes iniciar sesión para dejar una reseña.';
        } else {
          this.errorMessage = 'Error al enviar la reseña. Intente más tarde.';
        }
      }
    });
  }
}