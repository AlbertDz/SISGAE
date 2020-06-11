import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {Arancel} from '../../services/aranceles/arancel';
import {Concepto} from '../../services/aranceles/concepto';
import {ArancelesService} from '../../services/aranceles/aranceles.service';
import {Estudiante} from '../../services/estudiantes/estudiante';

import {OpcionConceptoComponent} from '../../modals/opcion-concepto/opcion-concepto.component';
import { StatusDatosComponent } from '../../modals/status-datos/status-datos.component';

// Componente principal

@Component({
  selector: 'app-planilla-aranceles',
  templateUrl: './planilla-aranceles.component.html',
  styleUrls: ['./planilla-aranceles.component.css']
})
export class PlanillaArancelesComponent implements OnInit {

  montoTotal: number = 0.00;
  conceptos: Concepto[];

  displayedColumns: string[] = ['codigo', 'concepto', 'cantidad', 'monto', 'subtotal', 'borrar'];
  dataSource: MatTableDataSource<Concepto>;

  @Input() estudiante: Estudiante;
  @Input() periodo: string;
  @Input() consultar: boolean;
  @Input() totalConcepto: number;
  @Output() total = new EventEmitter<number>();

  constructor(
    public dialog: MatDialog,
    private ArancelesService: ArancelesService,
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.ArancelesService.CONCEPTOS);
    (this.consultar) ?this.montoTotal=this.totalConcepto :this.totalConcepto;
  }

  public openDialog = (): void => {
    const dialogRef = this.dialog.open(AddArancelesComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != null) {
        this.ArancelesService.nuevoConcepto(result);

        this.dataSource._updateChangeSubscription();

        this.montoTotal += result.subtotal;
        this.enviarTotal(this.montoTotal);
      }

    });
  }

  public borrar = (concepto: Concepto): void => {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea borrar el concepto "${concepto.descripcion}" de la lista?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != null) {
        this.montoTotal -= concepto.subtotal;
        this.enviarTotal(this.montoTotal);

        this.ArancelesService.borrarConcepto(concepto);

        this.dataSource._updateChangeSubscription();
      }

    });
  }

  public enviarTotal = (valor: number): void => {
    this.total.emit(valor);
  }

}

// Componente para el dialog add-aranceles

@Component({
  selector: 'app-add-aranceles',
  templateUrl: './add-aranceles.component.html',
})

export class AddArancelesComponent implements OnInit {

  aranceles: Arancel[];
  concepto: Concepto;
  cargando: boolean = true;

  displayedColumns: string[] = ['codigo', 'concepto', 'monto'];
  dataSource: MatTableDataSource<Arancel>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<AddArancelesComponent>,
    private ArancelesService: ArancelesService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.ArancelesService.getConceptos()
      .subscribe(aranceles => {
        this.cargando = false;

        if (!aranceles.length) { this.errorBD('¡Lo siento, a ocurrido un error al mostrar los conceptos!', 'error') }
          else { this.datosTabla(aranceles) };
      });
  }

    public openDialog = (arancel: Arancel): void => {
    const dialogRef = this.dialog.open(ConfirmarCantidad, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != null) {
        this.concepto = {
          codigo: arancel.codigo,
          descripcion: arancel.descripcion,
          cantidad: result,
          monto: arancel.monto,
          subtotal: (arancel.monto * result),
        }

        this.dialogRef.close(this.concepto);
      }

    });
  }

  public onNoClick = (): void => {
    this.dialogRef.close();
  }

  private datosTabla = (aranceles: Arancel[]): void => {
    this.aranceles = aranceles;
    this.dataSource = new MatTableDataSource(aranceles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private errorBD = (mensaje: string, clase: string): void => {
    const dialogRef = this.dialog.open(StatusDatosComponent, {
      width: '600px',
      data: {
        mensaje: mensaje,
        clase: clase
      }
    });
  }

  public applyFilter = (event: Event): void => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

// Component para el dialog confirmar-cantidad

@Component({
  selector: 'app-confirmar-cantidad',
  templateUrl: './confirmar-cantidad.html',
})

export class ConfirmarCantidad implements OnInit {

  cantidad: number = 1;

  constructor(public dialogRef: MatDialogRef<ConfirmarCantidad>) {
  }

  ngOnInit() {
  }

  public onNoClick = (): void => {
    this.dialogRef.close();
  }
}
