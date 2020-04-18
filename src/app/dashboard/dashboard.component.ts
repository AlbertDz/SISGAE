import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {Arancel} from '../services/aranceles/arancel';
import {ArancelesService} from '../services/aranceles/aranceles.service';

import {OpcionConceptoComponent} from '../modals/opcion-concepto/opcion-concepto.component';
import { StatusDatosComponent } from '../modals/status-datos/status-datos.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements AfterViewInit {
	ngAfterViewInit() {}

  myForm: FormGroup;

  aranceles: Arancel[] = [];

	displayedColumns: string[] = ['codigo', 'concepto', 'monto', 'opcion'];
  dataSource: MatTableDataSource<Arancel>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private ArancelesService: ArancelesService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      codigo: new FormControl( null , Validators.required ),
      descripcion: new FormControl( null , Validators.required ),
      monto: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
    this.ArancelesService.getAranceles()
      .subscribe(aranceles => {
        this.datosTabla(aranceles)
      })
  }

  private datosTabla(aranceles: Arancel[]) {
    this.aranceles = aranceles;
    this.dataSource = new MatTableDataSource(aranceles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private errorBD(mensaje: string, clase: string) {
    const dialogRef = this.dialog.open(StatusDatosComponent, {
      width: '600px',
      data: {
        mensaje: mensaje,
        clase: clase
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private actualizarTabla(mensaje: string) {
    this._snackBar.open(mensaje, '', {
        duration: 3000,
    });

    this.ArancelesService.getAranceles()
      .subscribe(aranceles => {
        if (!aranceles.length) { this.errorBD('¡Lo siento, a ocurrido un error al traer los conceptos de la base de datos!', 'error') }
          else { this.datosTabla(aranceles) }
      });
  }

  addConcepto() {
    this.ArancelesService.addArancel(this.myForm.value)
      .subscribe(resp => {
        if (resp.insertId != 0 ) { this.errorBD('¡Lo siento, a ocurrido un error al guardar el concepto en la base de dato!', 'error') }
          else { this.actualizarTabla('¡Concepto agregado satisfactoriamente!') }
      });
  }

  deleteConcepto(arancel: Arancel) {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea eliminar el concepto "${arancel.descripcion}" de la base de datos?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null ) {
        this.ArancelesService.deleteArancel(arancel)
          .subscribe(resp => {
            if (resp.insertId != 0) { this.errorBD('¡Lo siento, a ocurrido un error al eliminar el concepto de la base de datos!', 'error') }
              else { this.actualizarTabla('¡Concepto eliminado satisfactoriamente!') }
          });
      }
    });


  }
}