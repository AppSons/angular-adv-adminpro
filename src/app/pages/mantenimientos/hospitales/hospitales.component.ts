import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';



@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales : Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription


  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(delay(100)
        )
        .subscribe(img => this.cargarHospitales());
  }

  buscar (termino: string) {

    if (termino.length === 0 ) {
      return this.cargarHospitales();
    }
     
    this.busquedaService.buscar( 'hospitales', termino)
        .subscribe( resp => {
          this.hospitales = resp as Hospital[];});

  }




  cargarHospitales() {
    this.cargando = true;

    this.hospitalService.cargarHospital()
        .subscribe( hospitales => {
          this.cargando = false;
          this.hospitales = hospitales;
        })
  }

  guardarCambios(hospital: Hospital) {

    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
        .subscribe( resp => {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        });
  }

  eliminarHospital(hospital: Hospital) {

    this.hospitalService.borrarHospital(hospital._id)
        .subscribe( resp => {
          this.cargarHospitales();
          Swal.fire('Borrado', hospital.nombre, 'success');
        });
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Agregar Hospital',
      text: 'Ingrese el Nombre del Nuevo Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    })
    
    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe( (resp: any) => {
          this.hospitales.push(resp.hospital)
        })
    }
  }

  abrirModal(hospital: Hospital){

    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

  

}
