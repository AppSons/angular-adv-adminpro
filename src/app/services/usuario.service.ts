import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { tap, map, catchError } from 'rxjs/operators';
import { pipe, Observable, of } from 'rxjs';

import { LoginForm } from '../interfaces/login-form-interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios';
import { RegisterForm } from '../interfaces/register.form.interfaces';
import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.models';



const base_url = environment.base_url;

declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }


  googleInit() {

    return new Promise( resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '768503514688-5omc35mr9de6hv2t05uku6l48pks3dur.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',          
        });

        resolve(this.auth2);
        
      });
    })
     
  }


  logout(){
    localStorage.removeItem('token');
    
    this.auth2.signOut().then(() => {
      this.ngZone.run(() =>{
        this.router.navigateByUrl('/login');
      })
      
    });
    
  }

  validarToken(): Observable<boolean>{
    
    return this.http.get(`${ base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const {email, google, nombre, role, img ='' , uid} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      
      catchError(error => of(false))
    );
  }

  crearUsuario( formData: RegisterForm){
    
    return this.http.post(`${ base_url}/usuarios`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
    
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string}) {

   data = {
     ...data,
     role: this.usuario.role
   }
   return this.http.put(`${ base_url}/usuarios/${ this.uid }`, data, this.headers);
  }

  login( formData: LoginForm){
    
    return this.http.post(`${ base_url}/login`, formData )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
    
  }

  loginGoogle( token ){
    
    return this.http.post(`${ base_url}/login/google`, {token} )
                .pipe(
                  tap( (resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                );
    
  }

  cargarUsuario(desde: number = 0) {

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuarios>(url, this.headers)
            .pipe(              
              map( resp => {
                const usuarios = resp.usuarios.map(
                  user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid ));

                return {
                  total: resp.total,
                  usuarios
                };
              })
            )
  }

  eliminarUsuario(usuario: Usuario) {

    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    
     return this.http.put(`${ base_url}/usuarios/${ usuario.uid }`, usuario, this.headers);
   }
}
