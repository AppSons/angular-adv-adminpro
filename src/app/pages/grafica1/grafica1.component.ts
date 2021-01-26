import { Component } from '@angular/core';




@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labels1: string[] = ['Insumos', 'Oficina', 'Repuestos'];
  public  data1 = [
    [130, 150, 90],
    
  ];
}
