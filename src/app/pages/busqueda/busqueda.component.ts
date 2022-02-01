import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { subscribeOn } from 'rxjs/operators';
import { BusquedasService } from '../../services/busquedas.service';
import { Usuario } from '../../models/usuario.models';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedasService: BusquedasService ) { }

  ngOnInit(): void {

    this.activatedRoute.params
        .subscribe(({termino}) => this.busquedaGlobal(termino));
  }

  busquedaGlobal(termino: string){

    this.busquedasService.busquedaGlobal(termino)
        .subscribe( (resp: any) => {
          console.log(resp);
          this.usuarios   = resp.usuarios;
          this.hospitales = resp.hospitales;
          this.medicos    = resp.medicos;
        });
  }

  abrirMedico(medico: Medico){
    
  }

}
