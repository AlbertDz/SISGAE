import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { PostgradoService } from '../../services/postgrado/postgrado.service';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { StatusDatosComponent } from '../../modals/status-datos/status-datos.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {OpcionConceptoComponent} from '../../modals/opcion-concepto/opcion-concepto.component';

@Component({
  selector: 'app-especializacion',
  templateUrl: './especializacion.component.html',
  styleUrls: ['./especializacion.component.css']
})
export class EspecializacionComponent implements OnInit {

  cargando: boolean = true;
  myForm: FormGroup;
  edicion: boolean = false;
  id: number;

  displayedColumns: string[] = ['numero', 'postgrado', 'id', 'opcion'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
  	private postgradoService: PostgradoService,
  	private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  	this.myForm = new FormGroup({
      nombre_postgrado: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
  	this.postgradoService.getPostgrados()
  		.subscribe(postgrados => {
  			this.datosTabla(postgrados);
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

  public addPostgrado = () => {
    this.cargando = true;

    if (this.edicion) { this.aplyUpdate(this.myForm.value) }
      else {
        this.postgradoService.addPostgrado(this.myForm.value)
          .subscribe(resp => {
            if (resp.insertId === 0 ) { this.errorBD('¡Lo siento, a ocurrido un error al guardar la especialización!', 'error') }
              else {
                this.actualizarTabla('¡Especialización agregada satisfactoriamente!');
                this.myForm.reset();
              }
          });
      }
  }

  public deletePostgrado = (postgrado: any) => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `Asegurese de haber eliminado las carreras correspondientes a esta especialización ¿Desea continuar?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null ) {
        this.cargando = true;
        this.postgradoService.deletePostgrado(postgrado.id_postgrado)
          .subscribe(resp => {
            if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al eliminar la especialización!', 'error') }
              else { this.actualizarTabla('¡Especialización eliminada satisfactoriamente!') }
          });
      }
    });
  }

  public updatePostgrado = (postgrado: any) => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea actualizar la especialización "${postgrado.nombre_postgrado}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
      	this.id = postgrado.id_postgrado;
        this.edicion = true;
        this.myForm.get('nombre_postgrado').setValue(postgrado.nombre_postgrado);
      }
    })
  }

  public cancelUpdate = () => {
    this.edicion = false;
    this.myForm.reset();
  }

  private aplyUpdate(postgrado: any) {
    this.postgradoService.updatePostgrado(this.id, postgrado)
      .subscribe(resp => {
        if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al actualizar la especialización!', 'error') }
          else {
            this.actualizarTabla('¡Especialización actualizada satisfactoriamente!');
            this.edicion = false;
            this.myForm.reset();
          }
      })
  }

  private actualizarTabla = (mensaje: string) => {
    this._snackBar.open(mensaje, '', {
        duration: 3000,
    });

    this.postgradoService.getPostgrados()
      .subscribe(postgrados => {
        if (!postgrados.length) { this.errorBD('¡Lo siento, a ocurrido un error al mostrar las especializaciones!', 'error') }
          else { this.datosTabla(postgrados) };        
      });
  }

}
