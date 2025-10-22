export type RolUsuario = 'CLIENTE' | 'ADMIN' | 'DISTRIBUIDOR'; 

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    whatsapp: string;
    rol: RolUsuario;
    estaAprobado: boolean;
    codigoReferenciaUsado: string;
    fechaCreacion: string;
}