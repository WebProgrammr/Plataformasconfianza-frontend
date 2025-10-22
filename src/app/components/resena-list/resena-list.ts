import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResenaService } from '../../services/resena';
import { Resena } from '../../core/models/resena.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-resena-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resena-list.html',
  styleUrls: ['./resena-list.scss']
})
export class ResenaListComponent implements OnInit {
  
  resenas: Resena[] = [];
  errorMessage: string | null = null;

  constructor(private resenaService: ResenaService) {}

  ngOnInit(): void {
    this.resenaService.getResenas().subscribe({
      next: (data: Resena[]) => {
        this.resenas = data.slice(0, 6);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching resenas', err);
        this.errorMessage = 'No se pudieron cargar las reseñas.';
      }
    });
  }

  getStars(calificacion: number): any[] {
    return new Array(calificacion);
  }
}