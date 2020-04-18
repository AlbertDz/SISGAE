import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface Mensaje {
  mensaje: string;
  clase: string;
}

@Component({
  selector: 'app-status-datos',
  templateUrl: './status-datos.component.html',
  styleUrls: ['./status-datos.component.css']
})
export class StatusDatosComponent implements OnInit {

  constructor(
  	public dialogRef: MatDialogRef<StatusDatosComponent>,
  	@Inject(MAT_DIALOG_DATA) public data: Mensaje,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
