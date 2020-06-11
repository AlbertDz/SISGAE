import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

import { PostgradoService } from '../../services/postgrado/postgrado.service';
import { CarreraService } from '../../services/carrera/carrera.service';
import { PeriodoService } from '../../services/periodo/periodo.service';
import { ArancelesService } from '../../services/aranceles/aranceles.service';
import { StatusDatosComponent } from '../../modals/status-datos/status-datos.component';
import {FormatosService} from '../../services/formatos/formatos.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-aranceles',
  templateUrl: './aranceles.component.html',
  styleUrls: ['./aranceles.component.css']
})
export class ArancelesComponent implements OnInit {

  myForm: FormGroup;
  carreras: any[] = [];
  carrera: number;
  postgrados: any[] = [];
  postgrado: number;
  periodos: any[] = [];
  periodo: string;
  meses: any[] = [];
  mes: number;
  cargando: boolean = false;
  aranceles: any[];
  resultados: boolean = false;
  totalRecaudado: number = 0;

  displayedColumns: string[] = ['numero', 'nombre', 'arancel', 'cedula', 'concepto', 'fecha', 'banco', 'referencia', 'monto'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private postgradoService: PostgradoService,
    private carreraService: CarreraService,
    private  periodoService: PeriodoService,
    private arancelesService: ArancelesService,
    private FormatosService: FormatosService,
    public dialog: MatDialog,
  ) {
    this.myForm = new FormGroup({
      elaborado: new FormControl( 'Lic. Mailys Flores' , Validators.required ),
      revisado: new FormControl( 'Dra. Luisa Sequera' , Validators.required ),
      conforme: new FormControl( 'Dra. Luisa Sequera' , Validators.required ),
      director: new FormControl( 'Dr. José G. Salcedo' , Validators.required ),
    });
  }

  ngOnInit() {
    this.postgradoService.getPostgrados()
      .subscribe(postgrados => this.postgrados = postgrados)
    this.periodoService.getPeriodos()
      .subscribe(periodos => this.periodos = periodos );
    
    this.datosDeLaTabla([]);
  }

  public valorPostgrado = (valor: number): void => {
    this.carrera = null;
  	this.carreraService.getCarreras(valor)
      .subscribe(carreras => this.carreras = carreras);
  }

  public valorPeriodo = (valor: string): void => {
    this.mes = null;
    this.periodoService.getMeses(valor)
      .subscribe(meses => this.meses = meses);
  }

  public disabled = (): boolean => {
    return (this.postgrado && this.carrera && this.periodo && this.mes) ?false :true;
  }

  public buscar = (): void => {
    this.cargando = true;
    let datos = {
      id_postgrado: this.postgrado,
      id_carrera: this.carrera,
      id_periodo: this.periodo,
      id_mes: this.mes
    };

    this.arancelesService.listAranceles(datos)
      .subscribe(aranceles => {
        if (aranceles.length !== 0) {
          aranceles.map(aranecel => {
            this.totalRecaudado += aranecel.monto;
          })

          this.resultados = true;
          this.aranceles = aranceles;
          this.datosDeLaTabla(this.aranceles);
        } else {
          this.resultados = false;
          this.totalRecaudado = 0;
          this.datosDeLaTabla([]);

          const dialogRef = this.dialog.open(StatusDatosComponent, {
            width: '600px',
            data: {
              mensaje: '¡No se han encontrado resultados!',
              clase: 'error'
            }
          });
        }

        this.cargando = false;
      });
  }

  private datosDeLaTabla = aranceles => {
    this.dataSource = new MatTableDataSource(aranceles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public generarPDF = (valor: number): void => {
    const nombreMes = this.meses.filter(mes => mes.id_mes === this.mes);

    const nombreCarrera = this.carreras.filter(carrera => carrera.id_carrera === this.carrera);

    const arrayPeriodo = this.periodo.split('-');
    const yearActual = arrayPeriodo[0];

    // Reporte de aranceles PDF
    let reporteArancelesPDF = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      // pageMargins: [ 50, 30 ],
      content: [
        {alignment: 'center', text: 'UNIVERSIDAD NACIONAL EXPERIMENTAL SIMÓN RODRIGUEZ'},
        {alignment: 'center', text: 'DECANATO DE EDUCACIÓN AVANZADA'},
        {alignment: 'center', bold: true, text: 'NÚCLEO LOS TEQUES'},
        {alignment: 'left', margin: [0, 30, 0, 0], text: `Especialización [ ${(this.postgrado === 1) ?'x' :' '} ]  -  Maestría [ ${(this.postgrado === 2) ?'x' :' '} ]  -  Doctorado [ ${(this.postgrado === 3) ?'x' :' '} ]`},
        {alignment: 'right', text: `Período Académico: ${this.periodo}`},
        {alignment: 'center', bold: true, margin: [0, 5, 0, 0], text: `RELACIÓN DE ARANCELES CORRESPONDIENTE AL MES:   ${nombreMes[0].nombre_mes.toUpperCase()} ${yearActual}`},
        {alignment: 'left', bold: true, margin: [10, 5, 0, 3], text: nombreCarrera[0].nombre_carrera},
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto'],
            body: this.mostrarAranceles(),
          }
        },
        {alignment: 'right', margin: [0, 3, 0, 0], text: `TOTAL RECAUDADO:`},
        {alignment: 'right', bold: true, text: `BS ${this.FormatosService.formatearNumero(this.totalRecaudado)}`},
        {
          columns: [
            {width: 200, text: 'ELABORADO POR:'},
            {width: 200, text: 'REVISADO POR:'},
            {width: 200, text: 'CONFORME POR:'}
          ]
        },
        {
          columns: [
            {width: 200, margin: [10, 2, 0, 0], text: this.myForm.get('elaborado').value},
            {width: 200, margin: [10, 2, 0, 0], text: this.myForm.get('revisado').value},
            {width: 200, margin: [10, 2, 0, 0], text: this.myForm.get('conforme').value}
          ]
        },
        {alignment: 'right', margin: [0, 5, 0, 0], text: `DIRECTOR: ${this.myForm.get('director').value}`}
      ],
      styles: {
        tableHeader: {
          bold: true,
          color: 'black'
        }
      },
      defaultStyle: {
        fontSize: 10,
      }
    }

    switch (valor) {
      case 1: pdfMake.createPdf(reporteArancelesPDF).open();
        break;
      case 2: pdfMake.createPdf(reporteArancelesPDF).download(`${this.postgrado}-${this.carrera}-${this.mes}-(${this.periodo})`);
        break;
      case 3: pdfMake.createPdf(reporteArancelesPDF).print();
        break;
    };
  }

  private mostrarAranceles = (): any[] => {
    let listaAranceles = [];
    let i = 1;

    listaAranceles.push([
      {text: 'DATOS DEL PARTICIPANTE', style: 'tableHeader', bold: false, alignment: 'center', colSpan: 4},
      {},
      {},
      {},
      {text: 'ARANCELES', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'DATOS ENTIDAD BANCARIA', style: 'tableHeader', bold: false, alignment: 'center', colSpan: 4},
      {},
      {},
      {}
    ])

    listaAranceles.push([
      {text: 'N°', style: 'tableHeader', alignment: 'center'},
      {text: 'NOMBRES Y APELLIDOS', style: 'tableHeader', alignment: 'center'},
      {text: 'N° ARANCEL', style: 'tableHeader', alignment: 'center'},
      {text: 'CÉDULA', style: 'tableHeader', alignment: 'center'},
      {text: 'CONCEPTO', style: 'tableHeader', alignment: 'center'},
      {text: 'FECHA', style: 'tableHeader', alignment: 'center'},
      {text: 'BANCO EMISOR', style: 'tableHeader', alignment: 'center'},
      {text: 'N° REFERENCIA', style: 'tableHeader', alignment: 'center'},
      {text: 'MONTO', style: 'tableHeader', alignment: 'center'},
    ])

    this.aranceles.forEach(arancel => {
      listaAranceles.push([
        i,
        `${arancel.primer_nombre} ${arancel.primer_apellido}`,
        arancel.id_planilla,
        arancel.cedula,
        arancel.concepto_principal,
        arancel.fecha,
        arancel.nombre_banco,
        arancel.valor_referencia,
        this.FormatosService.formatearNumero(arancel.monto)
      ])

      i++;
    });

    return listaAranceles;
  }

}
