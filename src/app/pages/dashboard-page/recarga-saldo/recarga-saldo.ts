// src/app/pages/dashboard-page/recarga-saldo/recarga-saldo.ts
import { Component, ElementRef, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RecargaService } from '../../../services/recarga';
import { RecargaRequestPayload } from '../../../core/models/api.models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recarga-saldo',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './recarga-saldo.html',
  styleUrls: ['./recarga-saldo.scss']
})
export class RecargaSaldo implements OnInit, OnDestroy, AfterViewInit {

  recargaForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Propiedades para el Tilt
  private tiltCardElement: HTMLElement | null = null;
  private cardContentElement: HTMLElement | null = null;
  private parallaxLayers: HTMLElement[] = [];
  
  // Variables para animación optimizada
  private animationFrameId: number | null = null;
  private currentRotation = { x: 0, y: 0 };
  private targetRotation = { x: 0, y: 0 };
  private currentScale = 1;
  private targetScale = 1;
  private isHovering = false;
  
  // Cache de dimensiones
  private cardRect: DOMRect | null = null;
  private cachedWidth = 0;
  private cachedHeight = 0;
  private resizeObserver: ResizeObserver | null = null;
  
  // ✅ NUEVO: Throttle para mousemove
  private lastMouseMoveTime = 0;
  private readonly MOUSE_THROTTLE = 14; // ms entre actualizaciones

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private recargaService: RecargaService
  ) {}

  ngOnInit(): void {
    this.recargaForm = this.fb.group({
      monto: [null, [Validators.required, Validators.min(1)]],
      metodoPago: ['YAPE', Validators.required],
      comprobanteUrl: [''],
      nota: ['']
    });
  }

  ngAfterViewInit(): void {
    this.tiltCardElement = this.el.nativeElement.querySelector('.interactive-tilt-card');
    
    if (this.tiltCardElement) {
      this.cardContentElement = this.tiltCardElement.querySelector('.banner-content');
      const layers = this.tiltCardElement.querySelectorAll('.parallax-layer');
      this.parallaxLayers = Array.from(layers) as HTMLElement[];
      
      // ✅ Forzar GPU acceleration en todos los elementos
      this.enableGPUAcceleration();
      
      // Cache inicial
      this.updateCardRect();
      
      // Observer para cambios de tamaño
      this.resizeObserver = new ResizeObserver(() => {
        this.updateCardRect();
      });
      this.resizeObserver.observe(this.tiltCardElement);
      
      console.log('✅ Banner tilt ultra-optimizado configurado');
    }
  }

  // ✅ NUEVO: Forzar aceleración GPU
  private enableGPUAcceleration(): void {
    const elements = [
      this.tiltCardElement,
      this.cardContentElement,
      ...this.parallaxLayers
    ].filter(el => el !== null) as HTMLElement[];

    elements.forEach(el => {
      el.style.willChange = 'transform';
      el.style.transform = 'translateZ(0)';
      el.style.backfaceVisibility = 'hidden';
    });
  }

  private updateCardRect(): void {
    if (this.tiltCardElement) {
      this.cardRect = this.tiltCardElement.getBoundingClientRect();
      this.cachedWidth = this.cardRect.width;
      this.cachedHeight = this.cardRect.height;
    }
  }

  // --- LÓGICA DEL FORMULARIO ---
  onSubmit(): void {
    if (this.recargaForm.invalid) {
      this.recargaForm.markAllAsTouched();
      this.errorMessage = "Por favor, corrige los errores en el formulario.";
      setTimeout(() => this.errorMessage = null, 4000);
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formValue = this.recargaForm.value;
    const payload: RecargaRequestPayload = { 
      ...formValue, 
      monto: Number(formValue.monto) 
    };

    this.recargaService.solicitarRecarga(payload).subscribe({
      next: (recargaCreada) => {
        this.isLoading = false;
        this.successMessage = `Solicitud de recarga por S/ ${payload.monto} enviada. Un administrador la revisará pronto. ¡No olvides enviar tu comprobante por WhatsApp!`;
        this.recargaForm.reset({ metodoPago: 'YAPE' });
        setTimeout(() => this.successMessage = null, 7000);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        const errorMsgBackend = typeof err.error === 'string' 
          ? err.error 
          : (err.error?.message || err.message);
        this.errorMessage = `Error al enviar la solicitud: ${errorMsgBackend || 'Intenta más tarde.'}`;
        setTimeout(() => this.errorMessage = null, 7000);
      }
    });
  }

  // --- ✅ EFECTO TILT ULTRA-OPTIMIZADO ---
  onMouseMove(event: MouseEvent): void {
    if (!this.tiltCardElement || !this.cardRect) return;

    // ✅ Throttle: Limitar frecuencia de cálculos
    const now = performance.now();
    if (now - this.lastMouseMoveTime < this.MOUSE_THROTTLE) {
      return;
    }
    this.lastMouseMoveTime = now;

    // Usar cache en lugar de getBoundingClientRect
    const x = event.clientX - this.cardRect.left;
    const y = event.clientY - this.cardRect.top;
    
    // ✅ Cálculos optimizados (evitar divisiones repetidas)
    const xPos = (x / this.cachedWidth) - 0.5;
    const yPos = (y / this.cachedHeight) - 0.5;

    const maxRotation = 7;
    
    // Actualizar targets
    this.targetRotation.x = yPos * -maxRotation * 2;
    this.targetRotation.y = xPos * maxRotation * 2;
    this.targetScale = 1.05;
    this.isHovering = true;

    // Iniciar animación si está detenida
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  onMouseLeave(): void {
    this.isHovering = false;
    this.targetRotation.x = 0;
    this.targetRotation.y = 0;
    this.targetScale = 1;
    
    if (!this.animationFrameId) {
      this.animate();
    }
  }

  // ✅ Loop de animación ultra-optimizado
  private animate = (): void => {
    if (!this.tiltCardElement) return;

    // Interpolación con diferentes velocidades
    const lerpRotation = this.isHovering ? 0.12 : 0.1;
    const lerpScale = this.isHovering ? 0.15 : 0.08;
    
    // Lerp optimizado (menos operaciones)
    const dx = this.targetRotation.x - this.currentRotation.x;
    const dy = this.targetRotation.y - this.currentRotation.y;
    const ds = this.targetScale - this.currentScale;
    
    this.currentRotation.x += dx * lerpRotation;
    this.currentRotation.y += dy * lerpRotation;
    this.currentScale += ds * lerpScale;

    // ✅ Usar directamente style (sin Renderer2 para mejor performance)
    // Tarjeta principal
    this.tiltCardElement.style.transform = 
      `perspective(1000px) rotateX(${this.currentRotation.x}deg) rotateY(${this.currentRotation.y}deg) scale3d(${this.currentScale}, ${this.currentScale}, ${this.currentScale})`;

    // Contenido principal (parallax reducido)
    if (this.cardContentElement) {
      const tx = this.currentRotation.y * -7.5; // Reducido de 15 a 7.5
      const ty = this.currentRotation.x * 7.5;
      this.cardContentElement.style.transform = 
        `translateZ(40px) translate(${tx}px, ${ty}px)`;
    }

    // ✅ Optimización de capas parallax (menos intensidad = menos repaint)
    const normalizedX = this.currentRotation.y * -0.033; // Pre-calculado
    const normalizedY = this.currentRotation.x * -0.033;
    
    // Usar for tradicional (más rápido que forEach)
    for (let i = 0; i < this.parallaxLayers.length; i++) {
      const layer = this.parallaxLayers[i];
      const intensity = 20 + (i * 10);
      const z = 20 + (i * 10);
      
      layer.style.transform = 
        `translate(${normalizedX * intensity}px, ${normalizedY * intensity}px) translateZ(${z}px)`;
    }

    // Determinar si continuar animando
    const threshold = 0.01;
    const isMoving = 
      Math.abs(dx) > threshold ||
      Math.abs(dy) > threshold ||
      Math.abs(ds) > threshold * 0.1;

    if (this.isHovering || isMoving) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else {
      // Detener animación y limpiar
      this.animationFrameId = null;
      
      // ✅ Cleanup de will-change cuando no se usa
      if (!this.isHovering) {
        this.tiltCardElement.style.willChange = 'auto';
        this.cardContentElement!.style.willChange = 'auto';
        this.parallaxLayers.forEach(layer => {
          layer.style.willChange = 'auto';
        });
        
        // Restaurar tras un frame para evitar flicker
        requestAnimationFrame(() => {
          if (!this.isHovering && this.tiltCardElement) {
            this.tiltCardElement.style.willChange = 'transform';
            this.cardContentElement!.style.willChange = 'transform';
            this.parallaxLayers.forEach(layer => {
              layer.style.willChange = 'transform';
            });
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    // ✅ Cleanup de will-change
    if (this.tiltCardElement) {
      this.tiltCardElement.style.willChange = 'auto';
    }
    if (this.cardContentElement) {
      this.cardContentElement.style.willChange = 'auto';
    }
    this.parallaxLayers.forEach(layer => {
      layer.style.willChange = 'auto';
    });
  }
}