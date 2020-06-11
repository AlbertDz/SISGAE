import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { PostgradoService } from '../../../services/postgrado/postgrado.service';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { StatusDatosComponent } from '../../../modals/status-datos/status-datos.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OpcionConceptoComponent} from '../../../modals/opcion-concepto/opcion-concepto.component';
import { CarreraService } from '../../../services/carrera/carrera.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent implements OnInit {

  cargando: boolean = true;
  myForm: FormGroup;
  edicion: boolean = false;
  id: number;
  postgrado: any;

  displayedColumns: string[] = ['numero', 'carrera', 'id', 'opcion'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
  	private postgradoService: PostgradoService,
  	private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private carreraService: CarreraService,
    private activatedRoute: ActivatedRoute,
  ) {
  	this.myForm = new FormGroup({
      nombre_carrera: new FormControl( null , Validators.required ),
      id_postgrado: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
  	this.postgradoService.getPostgrado(this.activatedRoute.snapshot.params.idEspecializacion)
  		.subscribe(postgrado => {
  			this.postgrado = postgrado[0];
  			this.myForm.get('id_postgrado').setValue(this.postgrado.id_postgrado);

  			this.carreraService.getCarreras(this.postgrado.id_postgrado)
  				.subscribe(carreras => {
  					this.datosTabla(carreras);
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

  public addCarrera = () => {
    this.cargando = true;

    if (this.edicion) { this.aplyUpdate(this.myForm.value) }
      else {
        this.carreraService.addCarrera(this.myForm.value)
          .subscribe(resp => {
            if (resp.insertId === 0 ) { this.errorBD('¡Lo siento, a ocurrido un error al guardar la carrera!', 'error') }
              else {
                this.actualizarTabla('¡Carrera agregada satisfactoriamente!');
                this.myForm.reset();
                this.myForm.get('id_postgrado').setValue(this.postgrado.id_postgrado);
              }
          });
      }
  }

  public deleteCarrera = (carrera: any) => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `Asegurese de haber eliminado las materias correspondientes a esta carrera ¿Desea continuar?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null ) {
        this.cargando = true;
        this.carreraService.deleteCarrera(carrera.id_carrera)
          .subscribe(resp => {
            if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al eliminar la carrera!', 'error') }
              else { this.actualizarTabla('¡Carrera eliminada satisfactoriamente!') }
          });
      }
    });
  }

  public updateCarrera = (carrera: any) => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea actualizar la carrera "${carrera.nombre_carrera}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
      	this.id = carrera.id_carrera;
        this.edicion = true;
        this.myForm.get('nombre_carrera').setValue(carrera.nombre_carrera);
      }
    })
  }

  public cancelUpdate = () => {
    this.edicion = false;
    this.myForm.reset();
    this.myForm.get('id_postgrado').setValue(this.postgrado.id_postgrado);
  }

  private aplyUpdate(carrera: any) {
    this.carreraService.updateCarrera(this.id, carrera)
      .subscribe(resp => {
        if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al actualizar la carrera!', 'error') }
          else {
            this.actualizarTabla('¡Carrera actualizada satisfactoriamente!');
            this.edicion = false;
            this.myForm.reset();
            this.myForm.get('id_postgrado').setValue(this.postgrado.id_postgrado);
          }
      })
  }

  private actualizarTabla = (mensaje: string) => {
    this._snackBar.open(mensaje, '', {
        duration: 3000,
    });

    this.carreraService.getCarreras(this.postgrado.id_postgrado)
      .subscribe(carreras => {
        if (!carreras.length) { this.errorBD('¡Lo siento, a ocurrido un error al mostrar las carreras!', 'error') }
          else { this.datosTabla(carreras) };        
      });
  }

}
