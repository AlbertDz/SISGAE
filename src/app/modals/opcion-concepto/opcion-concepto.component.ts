import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface Mensaje {
  mensaje: string;
}

@Component({
  selector: 'app-opcion-concepto',
  templateUrl: './opcion-concepto.component.html', 
  styleUrls: ['./opcion-concepto.component.css']
})
export class OpcionConceptoComponent implements OnInit {

  constructor(
  	public dialogRef: MatDialogRef<OpcionConceptoComponent>,
  	@Inject(MAT_DIALOG_DATA) public data: Mensaje,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
