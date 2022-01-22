import { Usuario } from '../models/usuario.models';

export interface CargarUsuarios {
    total: number;
    usuarios: Usuario[];
}