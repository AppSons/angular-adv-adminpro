import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css']
  
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre:['Juan de Los Palotes', Validators.required],
    email:['Prueba99@gmail.com', [Validators.required, Validators.email]],
    password:['123', Validators.required],
    passw2:['123', Validators.required],
    terminos:[true, Validators.required],
  }, {
    validators: this.passIguales('password', 'passw2')
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
       return;
    } 
    //Realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe( resp => {
          // navegar al dashboard
           this.router.navigateByUrl('/');
        }, (err) => {
          //Si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  campoNoValido( campo:string): boolean{
    
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
       return true;
    }else{
      return false;
    }
  }

  contrasenasNoValidas( ){
    const passw1 = this.registerForm.get('password').value;
    const passw2 = this.registerForm.get('passw2').value;

    if ((passw1 !== passw2) && this.formSubmitted ) {
        return true;
    } else {
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passIguales( passName1: string, passName2: string){

    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.get(passName1);
      const pass2Control = formGroup.get(passName2);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null)
        
      } else {
        pass2Control.setErrors({noEsIgual: true})
      }
    }
  }

  

}
