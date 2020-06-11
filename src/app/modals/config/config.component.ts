import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  myForm: FormGroup;
  cargando: boolean = true;
  cambiandoDatos: boolean = false;
  hide = true;
  idPregunta: number;

  constructor(
  	public dialogRef: MatDialogRef<ConfigComponent>,
  	private usuarioService: UsuarioService,
  	private _snackBar: MatSnackBar,
  ) {
  	this.myForm = new FormGroup({
      password: new FormControl( null, [Validators.required, Validators.minLength(8)] ),
      pregunta: new FormControl( null, Validators.required ),
      respuesta: new FormControl( null, Validators.required ),
    });
  }

  ngOnInit() {
  	this.usuarioService.getUsuario(localStorage.getItem('idUser'))
  		.subscribe(usuario => {
  			this.myForm.get('pregunta').setValue(usuario[0].pregunta);
  			this.myForm.get('respuesta').setValue(usuario[0].respuesta);
  			this.idPregunta = usuario[0].id_pregunta;

  			this.cargando = false;
  		})
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public cambiarPass() {
  	this.cambiandoDatos = true;

  	this.usuarioService.setPassword(localStorage.getItem('idUser'), this.myForm.get('password').value)
  		.subscribe(resp => {
  			if (resp.insertId != 0) {
  				this._snackBar.open('¡Lo siento, a ocurrido un error al actualizar la contraseña!', '', {
		            duration: 3000,
		        });
  			} else {
	            this._snackBar.open('¡Contraseña actualizado satisfactoriamente!', '', {
		            duration: 3000,
		        });
	        }

	        this.myForm.get('password').setValue(null);
		    this.cambiandoDatos = false
  		})
  }

  public cambiarPreguntaRespuesta() {
  	this.cambiandoDatos = true;
  	const preguntaRespuesta = {
  		pregunta: this.myForm.get('pregunta').value,
  		respuesta: this.myForm.get('respuesta').value
  	}

  	this.usuarioService.setPregunta(this.idPregunta, preguntaRespuesta)
  		.subscribe(resp => {
  			if (resp.insertId != 0) {
  				this._snackBar.open('¡Lo siento, a ocurrido un error al actualizar la pregunta/respuesta!', '', {
		            duration: 3000,
		        });
  			} else {
	            this._snackBar.open('¡Pregunta/Respuesta actualizada satisfactoriamente!', '', {
		            duration: 3000,
		        });
	        }

		    this.cambiandoDatos = false
  		})
  }

  public validar(datoForm: any): boolean {
  	if (datoForm.value === null) return true;
  		else if (datoForm.errors && datoForm.dirty) return true;
  			else  return false;
  }

}
