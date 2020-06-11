import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { StatusDatosComponent } from '../../../modals/status-datos/status-datos.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OpcionConceptoComponent} from '../../../modals/opcion-concepto/opcion-concepto.component';
import { CarreraService } from '../../../services/carrera/carrera.service';
import { ActivatedRoute, Params } from '@angular/router';
import { PeriodoService } from '../../../services/periodo/periodo.service';

@Component({
  selector: 'app-materia',
  templateUrl: './materia.component.html',
  styleUrls: ['./materia.component.css']
})
export class MateriaComponent implements OnInit {

  cargando: boolean = true;
  myForm: FormGroup;
  edicion: boolean = false;
  id: number;
  carrera: any;
  semestres: any[] = [];

  displayedColumns: string[] = ['numero', 'materia', 'uc', 'modalidad', 'semestre', 'opcion'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
  	private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private carreraService: CarreraService,
    private activatedRoute: ActivatedRoute,
    private periodoService: PeriodoService,
  ) {
  	this.myForm = new FormGroup({
      nombre_materia: new FormControl( null , Validators.required ),
      unidad_credito: new FormControl( null , [Validators.required, Validators.minLength(1)] ),
      modalidad: new FormControl( null , Validators.required ),
      id_carrera: new FormControl( null , Validators.required ),
      id_semestre: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
  	this.periodoService.getSemestres()
  		.subscribe(semestres => this.semestres = semestres);

  	this.carreraService.getCarrera(this.activatedRoute.snapshot.params.idCarrera)
  		.subscribe(carrera => {
  			this.carrera = carrera[0];
  			this.myForm.get('id_carrera').setValue(this.carrera.id_carrera);

  			this.carreraService.getMateriasID(this.carrera.id_carrera)
  				.subscribe(materias => {
  					this.datosTabla(materias);
  				})
  		})
  }

  public applyFilter = (event: Event): void => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private datosTabla= (valores: any[]) => {
    this.dataSource = new MatTableDataSource(valores);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cargando = false;
  }

  private errorBD = (mensaje: string, clase: string) => {
    this.cargando = false;
    const dialogRef = this.dialog.open(StatusDatosComponent, {
      width: '600px',
      data: {
        mensaje: mensaje,
        clase: clase
      }
    });
  }

  public addMateria = () => {
    this.cargando = true;

    if (this.edicion) { this.aplyUpdate(this.myForm.value) }
      else {
        this.carreraService.addMateria(this.myForm.value)
          .subscribe(resp => {
            if (resp.insertId === 0 ) { this.errorBD('¡Lo siento, a ocurrido un error al guardar la materia!', 'error') }
              else {
                this.actualizarTabla('¡Materia agregada satisfactoriamente!');
                this.myForm.reset();
                this.myForm.get('id_carrera').setValue(this.carrera.id_carrera);
              }
          });
      }
  }

  public deleteMateria = (materia: any) => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea eliminar la materia ${materia.nombre_materia}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null ) {
        this.cargando = true;
        this.carreraService.deleteMateria(materia.id_materia)
          .subscribe(resp => {
            if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al eliminar la materia!', 'error') }
              else { this.actualizarTabla('¡Materia eliminada satisfactoriamente!') }
          });
      }
    });
  }

  public updateMateria = (materia: any) => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea actualizar la materia "${materia.nombre_materia}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
      	this.id = materia.id_materia;
        this.edicion = true;
        this.myForm.get('nombre_materia').setValue(materia.nombre_materia);
        this.myForm.get('unidad_credito').setValue(materia.unidad_credito);
        this.myForm.get('modalidad').setValue(materia.modalidad);
        this.myForm.get('id_semestre').setValue(materia.id_semestre);
      }
    })
  }

  public cancelUpdate = () => {
    this.edicion = false;
    this.myForm.reset();
    this.myForm.get('id_carrera').setValue(this.carrera.id_carrera);
  }

  private aplyUpdate(materia: any) {
    this.carreraService.updateMateria(this.id, materia)
      .subscribe(resp => {
        if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al actualizar la materia!', 'error') }
          else {
            this.actualizarTabla('¡Materia actualizada satisfactoriamente!');
            this.edicion = false;
            this.myForm.reset();
            this.myForm.get('id_carrera').setValue(this.carrera.id_carrera);
          }
      })
  }

  private actualizarTabla = (mensaje: string) => {
    this._snackBar.open(mensaje, '', {
        duration: 3000,
    });

    this.carreraService.getMateriasID(this.carrera.id_carrera)
      .subscribe(materias => {
        if (!materias.length) { this.errorBD('¡Lo siento, a ocurrido un error al mostrar las materias!', 'error') }
          else { this.datosTabla(materias) };        
      });
  }


}
