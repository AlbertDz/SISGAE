import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';

import { ArancelesService } from '../../services/aranceles/aranceles.service';
import { DatoPlanilla } from '../../services/aranceles/planilla-arancel';

@Component({
  selector: 'app-consultar',
  templateUrl: './consultar.component.html',
  styleUrls: ['./consultar.component.css']
})
export class ConsultarComponent implements OnInit {

  planillas: DatoPlanilla[] = [];

  displayedColumns: string[] = ['cedula', 'nombre', 'postgrado', 'carrera', 'arancel', 'concepto'];
  dataSource: MatTableDataSource<DatoPlanilla>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Input() cedula: number;
  @Output() cargandoDatos = new EventEmitter<boolean>();

  constructor(
  	private ArancelesService: ArancelesService,
  	private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.ArancelesService.getPlanillas(this.cedula)
      .subscribe(planilla => this.planillas = planilla);

    if (this.planillas.length != 0) {
      this.dataSource = new MatTableDataSource(this.planillas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cargandoDatos.emit(true);
    }
    else {
      this._snackBar.open(`¡No se encontrarón resultados para ${this.cedula}!`, '', {
          duration: 3000,
      });
      this.cargandoDatos.emit(false);
    }
  }

  openDialog(planilla: DatoPlanilla): void {
  	console.log(planilla);
    // const dialogRef = this.dialog.open(Referencia, {
    //   width: '600px',
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result != null ) {
    //     this.BancosService.addReferencia(result);

    //     this.datosBancarios._updateChangeSubscription();

    //     this.montoBanco += result.monto;
    //     this.enviarTotal(this.montoBanco);
    //   }
    // });
  }

}
