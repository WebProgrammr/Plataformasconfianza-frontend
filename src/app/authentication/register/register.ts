import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { RegistroPayload } from '../../core/models/api.models';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {

  registerForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      whatsapp: ['', [Validators.required]],
      codigoReferenciaUsado: ['', [Validators.required]]
    });
  }

  onMouseMove(event: MouseEvent): void {
    const card = this.el.nativeElement.querySelector('.auth-card-wrapper');
    if (!card) return;
    const { clientX, clientY } = event;
    const { left, top, width, height } = card.getBoundingClientRect();
    const xRotation = 10 * ((clientY - top - height / 2) / height);
    const yRotation = -10 * ((clientX - left - width / 2) / width);
    this.renderer.setStyle(card, 'transform', 
      `perspective(1500px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.03)`
    );
  }

  onMouseLeave(): void {
    const card = this.el.nativeElement.querySelector('.auth-card-wrapper');
    if (card) {
      this.renderer.setStyle(card, 'transform', 
        'perspective(1500px) rotateX(0) rotateY(0) scale(1)'
      );
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null;
    this.successMessage = null;
    const payload: RegistroPayload = this.registerForm.value;

    this.authService.registrar(payload).subscribe({
      next: (response: Usuario) => {
        this.successMessage = '¡Registro exitoso! Un administrador revisará tu cuenta para aprobarla. Serás redirigido al Login.';
        this.registerForm.reset();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.errorMessage = 'El email ya está en uso.';
        } else {
          this.errorMessage = 'Error en el servidor. Intente más tarde.';
        }
      }
    });
  }
}