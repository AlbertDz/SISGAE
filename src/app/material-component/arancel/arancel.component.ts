import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {ArancelesService} from '../../services/aranceles/aranceles.service';
import {EstudiantesService} from '../../services/estudiantes/estudiantes.service';
import {Estudiante} from '../../services/estudiantes/estudiante';
import {Concepto} from '../../services/aranceles/concepto';
import {DatosReferencia} from '../../services/bancos/referencia';
import {BancosService} from '../../services/bancos/bancos.service';
import {FormatosService} from '../../services/formatos/formatos.service';
import { StatusDatosComponent } from '../../modals/status-datos/status-datos.component';
import { DatoPlanilla } from '../../services/aranceles/planilla-arancel';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-arancel',
  templateUrl: './arancel.component.html',
  styleUrls: ['./arancel.component.css']
})
export class ArancelComponent implements OnInit {

  conceptos: Concepto[] = [];
  referencias: DatosReferencia[] = [];
  planilla: DatoPlanilla;

  total: number = 0.00;
  banco: number = 0.00;
  diferencia: number = 0.00;

  estudiantes: Estudiante[];
  estudiante: Estudiante;

  displayedColumns: string[] = ['cedula', 'nombres', 'apellidos', 'postgrado', 'carrera'];
  dataSource: MatTableDataSource<Estudiante>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private verPlanilla: boolean = false;

  constructor(
    public dialog: MatDialog,
    private ArancelesService: ArancelesService,
    private EstudiantesService: EstudiantesService,
    private BancosService: BancosService,
    private FormatosService: FormatosService,
  ) {
    this.EstudiantesService.getEstudiantes()
      .subscribe(estudiantes => this.estudiantes = estudiantes);
    this.dataSource = new MatTableDataSource(this.estudiantes);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(estudiante): void {
    const dialogRef = this.dialog.open(DialogSelection, {
      width: '500px',
      data: {
        cedula: estudiante.cedula,
        primerNombre: estudiante.primerNombre,
        segundoNombre: estudiante.segundoNombre,
        primerApellido: estudiante.primerApellido,
        segundoApellido: estudiante.segundoApellido,
        postgrado: estudiante.postgrado,
        carrera: estudiante.carrera,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null ) {
        this.estudiante = result;
        this.ArancelesService.clearConceptos();
        this.BancosService.clearReferencias();
        this.total = 0.00;
        this.banco = 0.00;
        this.diferencia = 0.00;
        this.verPlanilla = true;
      }
    });
  }

  cancelar() {
    this.verPlanilla = false;
  }

  recibirTotal(valor: number) {
    this.total = valor;

    this.diferencia = this.banco - this.total;
  }

  recibirTotalBanco(valor: number) {
    this.banco = valor;

    this.diferencia = this.banco - this.total;
  }

  procesarPlanilla(valor: boolean) {
    if (valor) {

      // Planilla de aranceles PDF
      let planillaArancelesPDF = {
        pageSize: 'A4',
        pageMargins: [ 50, 30 ],
        content: [
          {
            columns: [
              {width: '*', bold: true, text: 'Universidad Nacional Experimental Simón Rodríguez'},
              {width: 80, bold: true, alignment: 'center', text: 'Nro Arancel'},
              {width: 80, bold: true, alignment: 'center', text: 'Fecha'}
            ]
          },
          {
            columns: [
              {width: '*', bold: true, text: 'Subdirección de Educación Avanzada'},
              {width: 80, bold: true, alignment: 'center', text:'2'},
              {width: 80, bold: true, alignment: 'center', text: '18/10/2019'}
            ]
          },
          {
            columns: [
              {width: '*', bold: true, text: 'Unidad de Administración'},
            ]
          },
          {
            columns: [
              {width: '*', bold: true, text: 'Núcleo Los Teques'},

            ]
          },
          {
            columns: [
              {width: '*', text: 'PLANILLA DE ARANCELES', style: 'header'},
              {width: 'auto', bold: true, alignment: 'right', text: 'Cohorte: 2019', margin: [0, 20, 0, 10]},
            ]
          },
          {
            columns: [
              {width: '*', bold: true, text: `Cédula: ${this.estudiante.cedula}`},
              {width: '*', bold: true, text: `Nombre: ${this.estudiante.primerNombre} ${this.estudiante.primerApellido}`},
            ]
          },
          {
            columns: [
              {width: '*', bold: true, text: `Postgrado: ${this.estudiante.postgrado}`},
              {width: '*', bold: true, text: `Area: ${this.estudiante.carrera}`},
            ]
          },
          {
            style: 'tableExample',
            table: {
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: this.mostrarConceptos(),
            }
          },
          {text: 'DATOS BANCARIOS', style: 'tableHeader'},
          {
            margin: [0, 5, 0, 0],
            table: {
              widths: ['auto', '*', 'auto', 'auto'],
              body: this.mostrarReferencias(),
            }
          },
          {alignment: 'center', margin: [0, 80, 0, 0], text: 'FIRMA Y SELLO', style: 'tableHeader'},
        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            margin: [0, 20, 0, 10]
          },
            tableExample: {
            margin: [0, 10]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        },
        defaultStyle: {
          fontSize: 12,
        }
      }

      // Guardar arancel en base de datos
      this.planilla = {
        estudiante: this.estudiante,
        numeroArancel: 111,
        conceptos: this.ArancelesService.CONCEPTOS,
        datosBancarios: this.BancosService.DATOS_BANCARIOS,
      }

      this.ArancelesService.addPlanilla(this.planilla);

      // Si los datos fueron guardados satisfactoriamente, generar el PDF
      this.verPlanilla = false;

      const dialogRef = this.dialog.open(StatusDatosComponent, {
        width: '600px',
        data: {
          mensaje: '¡Datos guardados satisfactoriamente!',
          clase: 'success'
        }
      });

      pdfMake.createPdf(planillaArancelesPDF).open(); // Abrir PDF en una nueva ventana
      // pdfMake.createPdf(documentDefinition).download(); // Descargar PDF
      // pdfMake.createPdf(documentDefinition).open({}, window); // Abrir PDf en la misma ventana
      // pdfMake.createPdf(documentDefinition).print(); // Imprimir PDF
    }
  }

  mostrarConceptos() {
    let listaConceptos = [];
    this.conceptos = this.ArancelesService.CONCEPTOS;

    listaConceptos.push([{text: 'Codigo', style: 'tableHeader', alignment: 'center'}, {text: 'Concepto', style: 'tableHeader', alignment: 'center'}, {text: 'Cant', style: 'tableHeader', alignment: 'center'}, {text: 'Monto', style: 'tableHeader', alignment: 'center'}, {text: 'Subtotal', style: 'tableHeader', alignment: 'center'}])

    this.conceptos.forEach(concepto => {
      listaConceptos.push([{text: concepto.codigo, alignment: 'center'}, concepto.descripcion, {text: this.FormatosService.formatearNumero(concepto.cantidad), alignment: 'right'}, {text: this.FormatosService.formatearNumero(concepto.monto), alignment: 'right'}, {text: this.FormatosService.formatearNumero(concepto.subtotal), alignment: 'right'}])
    });

    listaConceptos.push([{text: '', border: [false,false,false,false]}, {text: '', border: [false,false,false,false]}, {text: '', border: [false,false,false,false]},{text: 'Total', alignment: 'right', style: 'tableHeader'}, {text: this.FormatosService.formatearNumero(this.total), alignment: 'right', style: 'tableHeader'}])

    return listaConceptos;
  }

  mostrarReferencias() {
    let listaReferencias = [];
    this.referencias = this.BancosService.DATOS_BANCARIOS;

    listaReferencias.push([{text: 'Fecha', alignment: 'center', style: 'tableHeader'}, {text: 'Banco', alignment: 'center', style: 'tableHeader'}, {text: 'Referencia', alignment: 'center', style: 'tableHeader'}, {text: 'Monto', alignment: 'center', style: 'tableHeader'}])

    this.referencias.forEach(referencia => {
      listaReferencias.push([{text: this.FormatosService.formatearFecha(referencia.fecha), alignment: 'center'}, referencia.banco, {text: referencia.referencia, alignment: 'right'},{text: this.FormatosService.formatearNumero(referencia.monto), alignment: 'right'}])
    });

    return listaReferencias;
  }

}

@Component({
  selector: 'dialog-selection',
  templateUrl: './dialog-selection.html',
})
export class DialogSelection {

  constructor(
    public dialogRef: MatDialogRef<DialogSelection>,
    @Inject(MAT_DIALOG_DATA) public data: Estudiante
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
