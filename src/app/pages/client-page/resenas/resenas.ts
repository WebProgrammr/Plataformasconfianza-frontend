import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResenaService } from '../../../services/resena';
import { Resena } from '../../../core/models/resena.model';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink
  ],
  templateUrl: './resenas.html',
  styleUrls: ['./resenas.scss']
})
export class Resenas implements OnInit {

  resenas: Resena[] = [];
  errorMessage: string | null = null;
  isLoading = true;

  constructor(
    private resenaService: ResenaService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.resenaService.getResenas().subscribe({
      next: (data: Resena[]) => {
        this.resenas = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching resenas', err);
        this.errorMessage = 'No se pudieron cargar las reseñas.';
        this.isLoading = false;
      }
    });
  }

  getStars(calificacion: number): any[] {
    return new Array(calificacion);
  }
}