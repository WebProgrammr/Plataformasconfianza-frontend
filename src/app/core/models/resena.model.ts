export interface Resena {
  id: number;
  comentario: string;
  calificacion: number;
  idUsuario: number;
  fechaResena: string;
}

export interface SaveResena {
  comentario: string;
  calificacion: number;
}