import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { LoginPayload } from '../../core/models/api.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
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
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null;
    const payload: LoginPayload = this.loginForm.value;
    this.authService.login(payload).subscribe({
      next: (response) => {
        if (response.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas o cuenta no aprobada.';
        } else {
          this.errorMessage = 'Error en el servidor. Intente más tarde.';
        }
      }
    });
  }
}