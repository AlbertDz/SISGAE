import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostgradoService } from '../../../services/postgrado/postgrado.service';
import { CarreraService } from '../../../services/carrera/carrera.service';
import { PeriodoService } from '../../../services/periodo/periodo.service';
import { EstudiantesService } from '../../../services/estudiantes/estudiantes.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { StatusDatosComponent } from '../../../modals/status-datos/status-datos.component';
import { Router } from '@angular/router';

interface Recaudos {
  id_documento: number,
  nombre_documento: string,
  valor: boolean,
}

@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrls: ['./nuevo-ingreso.component.css']
})
export class NuevoIngresoComponent implements OnInit {

  myForm: FormGroup;
  RECAUDOS: Recaudos[] = [];
  carreras: any[] = [];
  postgrados: any[] = [];
  periodos: any[] = [{id_periodo: null}];
  step: number = 0;
  nacionalidad: any;
  registrando: boolean = false;

  constructor(
  	private postgradoService: PostgradoService,
    private carreraService: CarreraService,
    private  periodoService: PeriodoService,
    private estudiantesService: EstudiantesService,
    public dialog: MatDialog,
    private router: Router,
  ) {
  	this.myForm = new FormGroup({
      primerNombre: new FormControl( null , Validators.required ),
      segundoNombre: new FormControl( null ),
      primerApellido: new FormControl( null , Validators.required ),
      segundoApellido: new FormControl( null ),
      cedula: new FormControl( null , Validators.required ),
      fechaNacimiento: new FormControl( null , Validators.required ),
      nacionalidad: new FormControl( null , Validators.required ),
      lugarNacimiento: new FormControl( null , Validators.required ),
      telefono1: new FormControl( null , Validators.required ),
      telefono2: new FormControl( null ),
      telefonoLocal: new FormControl( null ),
      correo1: new FormControl( null , Validators.required ),
      correo2: new FormControl( null ),
      estado: new FormControl( null , Validators.required ),
      municipio: new FormControl( null , Validators.required ),
      parroquia: new FormControl( null , Validators.required ),
      sector: new FormControl( null , Validators.required ),
      calle: new FormControl( null , Validators.required ),
      casa: new FormControl( null , Validators.required ),
      cohorte: new FormControl( null , Validators.required ),
      postgrado: new FormControl( null , Validators.required ),
      carrera: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
    this.myForm.get('cohorte').disable();
  	this.postgradoService.getPostgrados()
      .subscribe(postgrados => this.postgrados = postgrados)
    this.periodoService.getPeriodos()
      .subscribe(periodos => this.periodos = periodos);
    this.estudiantesService.getNacionalidad()
      .subscribe(nacionalidad => this.nacionalidad = nacionalidad);
    this.estudiantesService.getDocumentos()
      .subscribe(documentos => {
        documentos.map(documento => {
          this.RECAUDOS.push({id_documento: documento.id_documento, valor: false, nombre_documento: documento.nombre_documento});
        })
      });
  }

  public registrarNuevoIngreso = () => {
    this.registrando = true;

  	let datosOrdenados = {
      primer_nombre: this.myForm.get('primerNombre').value,
      segundo_nombre: this.myForm.get('segundoNombre').value,
      primer_apellido: this.myForm.get('primerApellido').value,
      segundo_apellido: this.myForm.get('segundoApellido').value,
      cedula: this.myForm.get('cedula').value,
      fecha_nacimiento: this.myForm.get('fechaNacimiento').value,
      id_nacionalidad: this.myForm.get('nacionalidad').value,
      lugar_nacimiento: this.myForm.get('lugarNacimiento').value,
      telefono_principal: this.myForm.get('telefono1').value,
      telefono_secundario: this.myForm.get('telefono2').value,
      telefono_local: this.myForm.get('telefonoLocal').value,
      correo_principal: this.myForm.get('correo1').value,
      correo_secundario: this.myForm.get('correo2').value,
      estado: this.myForm.get('estado').value,
      municipio: this.myForm.get('municipio').value,
      parroquia: this.myForm.get('parroquia').value,
      sector: this.myForm.get('sector').value,
      calle: this.myForm.get('calle').value,
      casa_apartamento: this.myForm.get('casa').value,
      id_carrera: this.myForm.get('carrera').value,
      cohorte: this.periodos[0].id_periodo
    }

    let documentos = []
    this.RECAUDOS.map(recaudo => {
      documentos.push({
        cedula: this.myForm.get('cedula').value,
        id_documento: recaudo.id_documento,
        status: recaudo.valor
      })
    })

    this.estudiantesService.nuevoIngreso(datosOrdenados)
      .subscribe(result => {
        if (result.insertId === 0) {
          this.estudiantesService.addDocumentos(documentos)
            .subscribe(result => {
              if (result.insertId === 0) {
                const dialogRef = this.dialog.open(StatusDatosComponent, {
                  width: '600px',
                  data: {
                    mensaje: '¡Datos guardados satisfactoriamente!',
                    clase: 'success'
                  }
                });

                this.router.navigate(['/estudiante']);
              }

              this.registrando = false;
            })
        } else {
          const dialogRef = this.dialog.open(StatusDatosComponent, {
            width: '600px',
            data: {
              mensaje: `¡Ha ocurrido un error al registrar el estudiante!`,
              clase: 'error'
            }
          });

          this.registrando = false;
        }
      })
  }

  public setStep = (index: number) => {
    this.step = index;
  }

  public valorPostgrado = (valor: number): void => {
  	this.carreraService.getCarreras(valor)
      .subscribe(carreras => this.carreras = carreras);
  }

  public onSelection(event: any) {
    this.RECAUDOS[event.option.value].valor = event.option.selected;
  }

}
