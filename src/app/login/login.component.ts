import { Component, OnInit } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LoginService } from '../services/login/login.service';
import { StatusDatosComponent } from '../modals/status-datos/status-datos.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  cargando: boolean = false;

  constructor(
  	private loginService: LoginService,
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
  	this.myForm = new FormGroup({
      cedula: new FormControl( null , Validators.required ),
      password: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
  }

  login() {
    this.cargando = true;

  	this.loginService.login(this.myForm.value)
  		.subscribe(resp => {
          this.cargando = false;

  			if (resp.mensaje) {
  				const dialogRef = this.dialog.open(StatusDatosComponent, {
			      width: '600px',
			      data: {
			        mensaje: resp.mensaje,
			        clase: 'error'
			      }
			    });
  			} else {
  				if (resp.tokenAnalista) {
  					this.loginService.setToken(resp.tokenAnalista, 'analista');
  				} else {
  					this.loginService.setToken(resp.tokenControlEstudio, 'control-estudio');
  				}

          this._snackBar.open('¡felicidades a iniciado sesión!', '', {
            duration: 3000,
          });
  				this.router.navigate(['/inicio']);
  			}
  		})
  }

}
