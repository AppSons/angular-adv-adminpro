import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Medico } from '../../../models/medico.model';
import { Hospital } from '../../../models/hospital.model';

import { MedicoService } from '../../../services/medico.service';
import { HospitalService } from '../../../services/hospital.service';
import { delay } from 'rxjs/operators';


@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params
          .subscribe( ({id}) => this.cargarMedico(id));
    
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });
    this.cargarHopsitales();

    this.medicoForm.get('hospital').valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId);
        
      });
  }

  cargarMedico(id: string){
    if (id === 'nuevo') {
      return;
    }
    this.medicoService.getMedicoById(id)
        .pipe(
          delay(100)
        )
        .subscribe( medico => {
          if (!medico) {
            this.router.navigateByUrl(`/dashboard/medicos`);
          }
          const { nombre, hospital:{_id}} = medico;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({nombre, hospital: _id});
        });
  }
  cargarHopsitales(){

    this.hospitalService.cargarHospital()
      .subscribe((hospitales: Hospital[])=> {
        this.hospitales = hospitales;
      })
  }
  guardarMedico(){

    const {nombre}= this.medicoForm.value;

    if (this.medicoSeleccionado) {
      //actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data)
          .subscribe( resp => {
            Swal.fire('Actualizado', `${nombre} actualizado correctamente`,'success' );
            this.router.navigateByUrl(`/dashboard/medicos`);
          });
    } else { 
      //crear
      this.medicoService.crearMedico(this.medicoForm.value)
      .subscribe( (resp: any) => {
        Swal.fire('Creado', `${nombre} creado correctamente`,'success' );
        this.router.navigateByUrl(`/dashboard/medicos`);
      });
    }
  }

}
