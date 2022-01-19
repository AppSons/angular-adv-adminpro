import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { tap, map, catchError } from 'rxjs/operators';

import { RegisterForm } from '../interfaces/register.form.interfaces';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form-interface';
import { pipe, Observable, of } from 'rxjs';
import { Router } from '@angular/router';


const base_url = environment.base_url;

declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
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
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true ),
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
}
