import { Component, ElementRef, Renderer2, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recarga-saldo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recarga-saldo.html',
  styleUrls: ['./recarga-saldo.scss']
})
export class RecargaSaldo implements OnDestroy, AfterViewInit {

  private tiltCard: HTMLElement | null = null;
  private cardContent: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.tiltCard = this.el.nativeElement.querySelector('.interactive-tilt-card');
    if (this.tiltCard) {
      this.cardContent = this.tiltCard.querySelector('.anuncio-content');
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.tiltCard) return;

    const card = this.tiltCard;
    const { clientX, clientY } = event;
    const { left, top, width, height } = card.getBoundingClientRect();
    const mouseX = clientX - left - width / 2;
    const mouseY = clientY - top - height / 2;
    const intensity = 12;
    const rotateX = (mouseY / (height / 2)) * intensity;
    const rotateY = -(mouseX / (width / 2)) * intensity;

    this.renderer.setStyle(card, 'transition', 'none');
    this.renderer.setStyle(card, 'transform',
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    );

    if (this.cardContent) {
        const translateZ = 30;
        const contentIntensity = 0.6; // Aumentar ligeramente el parallax
        const contentTranslateX = -rotateY * contentIntensity;
        const contentTranslateY = rotateX * contentIntensity;
        this.renderer.setStyle(this.cardContent, 'transition', 'none');
        this.renderer.setStyle(this.cardContent, 'transform', `translateZ(${translateZ}px) translateX(${contentTranslateX}px) translateY(${contentTranslateY}px)`);
    }
  }

  onMouseLeave(): void {
    if (!this.tiltCard) return;

    this.renderer.setStyle(this.tiltCard, 'transition', 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)');
    this.renderer.setStyle(this.tiltCard, 'transform',
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    );

    if (this.cardContent) {
      this.renderer.setStyle(this.cardContent, 'transition', 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)');
      this.renderer.setStyle(this.cardContent, 'transform', 'translateZ(0px) translateX(0px) translateY(0px)');
    }
  }

  ngOnDestroy(): void {
    // Limpieza si fuera necesaria
  }
}