import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';



@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  
  
  public medicos: Medico[] = [];
  public cargando = true;
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
        .pipe(delay(100)
        )
        .subscribe(img => this.cargarMedicos());
  }
  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
        .subscribe( medicos => {
          this.medicos = medicos;
          this.cargando = false;
      })
  }

  buscar (termino: string) {
    if (termino.length === 0 ) {
      return this.cargarMedicos();
    }
    this.busquedasService.buscar( 'medicos', termino)
        .subscribe( resp => {
          this.medicos = resp});

  }

  abrirModal(medico: Medico) {

    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );

  }

  borrarMedico(medico: Medico){
    Swal.fire({
      title: 'Borrar Médico?',
      text: `Esta a punto de Borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      //confirmButtonColor: '#3085d6',
      //cancelButtonColor: '#d33',
      confirmButtonText: 'Sí Borrar Médico'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.medicoService.borrarMedico(medico._id)
            .subscribe( resp => {
              this.cargarMedicos();
              Swal.fire(
                'Médico Borrado',
                `${medico.nombre} se eliminó corectamente`,
                'success'
              );
            });
      }
    })
  }

  
}
