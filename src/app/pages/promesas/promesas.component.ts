import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    })
    ////creo la promesa
    //const promesa = new Promise(( resolve, reject )=> {
    //  
    //  if (false){
    //    resolve('Hola Mundo');
    //  }else {
    //    reject ('Algo salió mal');
    //  }
    //
    //});
    ////escucho la promesa
    //promesa.then((mensaje) => {
    //  console.log(mensaje);
    //})
    ////manejo el error
    //.catch( error => console.log('Error en mi promesa', error));
    //
    //console.log('Fin del Init');

  }
  getUsuarios() {

    return new Promise( resolve => {
       
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then( body => resolve( body.data));
    });
  }

}
