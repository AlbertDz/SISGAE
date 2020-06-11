import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  myForm: FormGroup;
  cargando: boolean = true;
  cedulaActual: number;
  cambiandoDatos: boolean = false;

  constructor(
  	public dialogRef: MatDialogRef<PerfilComponent>,
  	private usuarioService: UsuarioService,
  	private _snackBar: MatSnackBar,
  	private router: Router,
  	private cookie: CookieService,
  ) {
  	this.myForm = new FormGroup({
      id_usuario: new FormControl( null , Validators.required ),
      primer_nombre: new FormControl( null , Validators.required ),
      segundo_nombre: new FormControl( null ),
      primer_apellido: new FormControl( null , Validators.required ),
      segundo_apellido: new FormControl( null ),
      cargo: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
  	this.usuarioService.getUsuario(localStorage.getItem('idUser'))
  		.subscribe(usuario => {
  			this.myForm.get('id_usuario').setValue(usuario[0].id_usuario);
  			this.myForm.get('primer_nombre').setValue(usuario[0].primer_nombre);
  			this.myForm.get('segundo_nombre').setValue(usuario[0].segundo_nombre);
  			this.myForm.get('primer_apellido').setValue(usuario[0].primer_apellido);
  			this.myForm.get('segundo_apellido').setValue(usuario[0].segundo_apellido);
  			this.myForm.get('cargo').setValue(usuario[0].cargo);

  			this.cedulaActual = usuario[0].id_usuario;
  			this.cargando = false;
  		})
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public actualizarUsuario() {
    this.cambiandoDatos = true;

  	this.usuarioService.setUsuario(localStorage.getItem('idUser'), this.myForm.value)
  		.subscribe(resp => {
  			if (resp.insertId != 0) {
  				this._snackBar.open('¡Lo siento, a ocurrido un error al actualizar el usuario!', '', {
		            duration: 3000,
		        });
  			} else {
	            this._snackBar.open('¡Usuario actualizado satisfactoriamente!', '', {
		            duration: 3000,
		        });

	            if (this.cedulaActual === this.myForm.get('id_usuario').value) {
	            	this.usuarioService.setNombreApellido(`${this.myForm.get('primer_nombre').value} ${this.myForm.get('primer_apellido').value}`);
                this.dialogRef.close();
	            } else {
	            	this.cookie.delete('token');
      					localStorage.removeItem('acceso');
      					localStorage.removeItem('idUser')
      					this.router.navigate(['/login']);
                this.dialogRef.close();
	            }
	        }

        this.cambiandoDatos = false;
  		})
  }

}
