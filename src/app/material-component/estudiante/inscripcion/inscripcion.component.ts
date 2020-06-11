import { Component, OnInit } from '@angular/core';
import { EstudiantesService } from '../../../services/estudiantes/estudiantes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PeriodoService } from '../../../services/periodo/periodo.service';
import { CarreraService } from '../../../services/carrera/carrera.service';
import { MatTableDataSource } from '@angular/material/table';
import { ArancelesService } from '../../../services/aranceles/aranceles.service';
import { StatusDatosComponent } from '../../../modals/status-datos/status-datos.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormatosService} from '../../../services/formatos/formatos.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.css']
})
export class InscripcionComponent implements OnInit {

  situacion: number;
  semestres: any[] = [];
  semestre: number;
  estudiante: any;
  materias: any[];
  periodos: any[] = [{id_periodo: null}];
  materiasInscritas: any[] = [];
  cantidadMaterias: number = 0;
  unidadesCredito: number = 0;
  documentos: any[] = [];
  recaudos: any[] = [];
  procesandoDocumentos: boolean = true;
  arancel: number;
  procesandoPlanilla: boolean = false;
  datosArancel: any[];
  planilla: any;
  fecha: string;

  displayedColumns: string[] = [ 'position', 'materia', 'uc', 'modalidad'];
  dataSource: MatTableDataSource<any>;
  dataSources: MatTableDataSource<any>;

  constructor(
    private estudiantesService: EstudiantesService,
    private activatedRoute: ActivatedRoute,
    private periodoService: PeriodoService,
    private carreraService: CarreraService,
    private arancelesService: ArancelesService,
    public dialog: MatDialog,
    private router: Router,
    private FormatosService: FormatosService,
  ) { }

  ngOnInit() {
    this.periodoService.getPeriodos()
      .subscribe(periodos => this.periodos = periodos);

    this.estudiantesService.getEstudianteCedula(this.activatedRoute.snapshot.params.cedula)
      .subscribe(estudiante => this.estudiante = estudiante[0]);

    this.periodoService.getSemestres()
      .subscribe(semestres => this.semestres = semestres);

    this.estudiantesService.documentosFaltantes(this.activatedRoute.snapshot.params.cedula)
      .subscribe(documentos => {
        this.documentos = documentos;
        this.procesandoDocumentos = false;
      });
  }

  selectSemestre(event: any) {
    this.carreraService.materiasSemestre(this.estudiante.id_carrera, event.value)
      .subscribe(materias => {
        this.materias = materias
        this.dataSource = new MatTableDataSource(this.materias);
      });
  }

  selectSituacion(event: any) {
    if (event.value === '0') {
      this.carreraService.materiasSemestre(this.estudiante.id_carrera, 1)
        .subscribe(materias => {
          this.materias = materias
          this.dataSource = new MatTableDataSource(this.materias);
        });
    }
  }

  inscribirMateria(materia: any) {
    var indice = this.materiasInscritas.indexOf(materia);
 
    if (indice !== -1) {
      this.cantidadMaterias--;
      this.unidadesCredito -= materia.unidad_credito;
      this.materiasInscritas.splice(indice, 1);
      this.dataSources = new MatTableDataSource(this.materiasInscritas);
    } else {
      this.materiasInscritas.push(materia);
      this.dataSources = new MatTableDataSource(this.materiasInscritas);
      this.cantidadMaterias++;
      this.unidadesCredito += materia.unidad_credito;
    }

  }

  onSelection(event: any) {
    var indice = this.recaudos.indexOf(event.option.value);
 
    if (indice !== -1) {
      this.recaudos.splice(indice, 1);
    } else {
      this.recaudos.push(event.option.value);
    }
  }

  guardarDocumentos() {
    this.procesandoDocumentos = true;

    for (let i=0; i<this.recaudos.length; i++) {
      this.estudiantesService.updateDocumentos(this.activatedRoute.snapshot.params.cedula, this.recaudos[0])
        .subscribe(documentos => {
          this.documentos = documentos
          this.procesandoDocumentos = false;
        })
    }

    this.recaudos = [];
  }

  procesarInscripcion() {
    this.procesandoPlanilla = true;
    let situacionActual = '';

    (this.situacion === 0) ?situacionActual = 'Nuevo ingreso' :situacionActual = 'Regular';

    this.estudiantesService.generarPlanilla({tipo: 'Inscripción', situacion: situacionActual})
      .subscribe(result => {
        this.planilla = result[0];
        this.fecha = `${result[0].dia}/${result[0].mes}/${result[0].anio}`;

        const datos = [];
        for (let i=0; i<this.materiasInscritas.length; i++) {
          datos.push({
            id_planilla_materia: this.planilla.id_planilla_materia,
            cedula: this.activatedRoute.snapshot.params.cedula,
            id_materia: this.materiasInscritas[i].id_materia,
            nota: null,
            aprobado: null})
        }

        this.estudiantesService.inscribirMaterias(datos)
          .subscribe(result => {
            if (result.insertId === 0) {
              this.generarPDF(1);

              this.procesandoPlanilla = false;
              this.router.navigate(['/estudiante']);
              const dialogRef = this.dialog.open(StatusDatosComponent, {
                width: '600px',
                data: {
                  mensaje: '¡Materias inscritas satisfactoriamente!',
                  clase: 'success'
                }
              });
            }
          })
      })
  }

  buscarArancel() {
    this.arancelesService.getArancel(this.arancel)
      .subscribe(arancel => this.datosArancel = arancel)
  }

  public generarPDF = (valor: number): void => {
    // Planilla inscripción PDF
    let planillaArancelesPDF = {
      pageSize: 'A4',
      pageMargins: [ 30, 30 ],
      content: [
        {alignment: 'center', fontSize: 12, bold: true, text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA'},
        {alignment: 'center', fontSize: 12, bold: true, text: 'UNIVERSIDAD NACIONAL EXPERIMENTAL SIMÓN RODRIGUEZ'},
        {alignment: 'center', fontSize: 12, bold: true, text: 'CONTROL DE ESTUDIOS - POSTGRADO'},
        {alignment: 'center', fontSize: 12, bold: true, text: 'NÚCLEO LOS TEQUES'},
        {
          columns: [
            {width: '*', text: ''},
            {width: 150, text: this.fecha}
          ]
        },
        {
          columns: [
            {width: '*', text: ''},
            {width: 150, text: `TIPO: ${this.planilla.tipo.toUpperCase()}`}
          ]
        },
        {
          columns: [
            {width: '*', text: ''},
            {width: 150, text: `SITUACIÓN: ${this.planilla.situacion.toUpperCase()}`}
          ]
        },
        {alignment: 'center', text: 'PLANILLA DE INSCRIPCIÓN DE CURSOS'},
        {alignment: 'center', text: `PÉRIODO ACADÉMICO ${this.periodos[0].id_periodo}`},
        {
          columns: [
            {width: 'auto', margin: [0, 20, 10, 10], text: `PARTICIPANTE: ${this.estudiante.primer_apellido.toUpperCase()} ${this.estudiante.segundo_apellido.toUpperCase()}, ${this.estudiante.primer_nombre.toUpperCase()} ${this.estudiante.segundo_nombre.toUpperCase()}`},
            {width: 'auto', margin: [0, 20, 10, 10], text: `CEDULA: ${this.estudiante.cedula}`},
            {width: 'auto', margin: [0, 20, 10, 10], text: `COHORTE: ${this.estudiante.cohorte}`},
            {width: 'auto', margin: [0, 20, 0, 10], bold: true, text: `PLANILLA N° ${this.planilla.id_planilla_materia}`},
          ]
        },
        {
          columns: [
            {width: 'auto', margin: [0, 0, 10, 0],  text: `PROGRAMA: ${this.estudiante.nombre_postgrado.toUpperCase()}`},
            {width: 'auto', margin: [0, 0, 0, 0],  text: `CARRERA: ${this.estudiante.nombre_carrera.toUpperCase()}`}
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: this.mostrarMaterias(),
          }
        },
        {
          columns: [
            {alignment: 'center', margin: [0, 20, 0, 0], width: '*', text: `CURSOS INSCRITOS: ${this.cantidadMaterias}`},
            {alignment: 'center', margin: [0, 20, 0, 0], width: '*', text: `CREDITOS: ${this.unidadesCredito}`}
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            body: this.mostrarConceptos(),
          }
        },
        {margin: [0, 20, 0, 0], bold: true, text: 'DOCUMENTOS PENDIENTE POR ENTREGAR'},
        {
          style: 'tableExample',
          table: {
            widths: ['auto'],
            body: this.mostrarDocumentos(),
          }
        },
        {
          columns: [
            {alignment: 'right', width: '*', text: 'N° de Arancel:'},
            {alignment: 'center', width: 100, text: this.arancel}
          ]
        },
        {
          columns: [
            {alignment: 'right', width: '*', text: 'Monto:'},
            {alignment: 'center', width: 100, text: this.FormatosService.formatearNumero(this.datosArancel[0].total_banco)}
          ]
        },
        {
          columns: [
            {alignment: 'right', width: '*', text: 'Fecha:'},
            {alignment: 'center', width: 100, text: `${this.datosArancel[0].dia}/${this.datosArancel[0].mes}/${this.datosArancel[0].anio}`}
          ]
        },
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
          fontSize: 10,
          color: 'black'
        }
      },
      defaultStyle: {
        fontSize: 10,
      }
    }

    switch (valor) {
      case 1: pdfMake.createPdf(planillaArancelesPDF).open();
        break;
      case 2: pdfMake.createPdf(planillaArancelesPDF).download(`INSCRIPCIÓN-${this.activatedRoute.snapshot.params.cedula}-${this.planilla.id_planilla}-(${this.periodos[0].id_periodo}))`);
        break;
      case 3: pdfMake.createPdf(planillaArancelesPDF).print();
        break;
    };
  }

  private mostrarMaterias(): any[] {
    let listaMaterias = [];
    let i = 1;

    listaMaterias.push([
      {text: 'N', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'CODIGO', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'CURSOS INSCRITOS', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'U.C', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'SEC', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'DIA', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'HORA', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'MODALIDAD', style: 'tableHeader', bold: false, alignment: 'center'},
      {text: 'TURNO', style: 'tableHeader', bold: false, alignment: 'center'}
    ])

    this.materiasInscritas.forEach(materia => {
      listaMaterias.push([
        i,
        materia.id_materia,
        materia.nombre_materia,
        materia.unidad_credito,
        'UNICA',
        'SABADO',
        '09:30am - 10:30am',
        materia.modalidad,
        'DIURNO'
      ])

      i++;
    });

    return listaMaterias;
  }

  private mostrarConceptos(): any[] {
    let listaConceptos = [];

    listaConceptos.push([
      {text: 'CONTROL ADMINISTRATIVO', style: 'tableHeader', bold: false, alignment: 'center', colSpan: 2},
      {},
    ])

    for (let i=0; i<this.datosArancel.length; i++) {
      if (i !== (this.datosArancel.length - 1)) {
        listaConceptos.push([
          {text: `COSTO ${this.datosArancel[i].descripcion.toUpperCase()}: ${this.FormatosService.formatearNumero(this.datosArancel[i].monto)}`, style: 'tableHeader', bold: false, colSpan: 2},
          {},
        ])
      } else {
        listaConceptos.push([
          {text: `COSTO ${this.datosArancel[i].descripcion.toUpperCase()}: ${this.FormatosService.formatearNumero(this.datosArancel[i].monto)}`, style: 'tableHeader', bold: false},
          {text: `TOTAL A CANCELAR MATRICULA: ${this.FormatosService.formatearNumero(this.datosArancel[i].total_conceptos)}`, style: 'tableHeader', bold: false},
        ])
      }
    }

    return listaConceptos;
  }

  private mostrarDocumentos(): any[] {
    let listaDocumentos = [];

    this.documentos.forEach(documento => {
      listaDocumentos.push([
        {text: documento.nombre_documento, style: 'tableHeader', bold: false},
      ])
    });

    return listaDocumentos;
  }

}
