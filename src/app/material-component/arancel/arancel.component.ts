import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
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
import { Periodo } from '../../services/periodo/periodo';
import { PeriodoService } from '../../services/periodo/periodo.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-arancel',
  templateUrl: './arancel.component.html',
  styleUrls: ['./arancel.component.css']
})
export class ArancelComponent implements OnInit {

  cargando: boolean = false;
  generar: boolean = false;

  conceptos: Concepto[] = [];
  referencias: DatosReferencia[] = [];
  planillas: DatoPlanilla[] = [];
  planilla: DatoPlanilla;
  periodos: Periodo[] = [];
  periodo: string;
  total: number = 0.00;
  banco: number = 0.00;
  diferencia: number = 0.00;
  estudiante: Estudiante;
  cedula: number;
  buscar: boolean = false;
  consultar: boolean = false;
  verArancel: boolean = false;
  verConsulta: boolean = false;
  idArancel: number;
  fecha: string;
  verPlanilla: boolean = false;

  displayedColumns: string[] = ['cedula', 'nombres', 'apellidos', 'postgrado', 'carrera'];
  displayedColumn: string[] = ['cedula', 'nombre', 'postgrado', 'carrera', 'arancel', 'periodo'];
  dataSources: MatTableDataSource<any>;
  dataSource: MatTableDataSource<Estudiante>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private ArancelesService: ArancelesService,
    private EstudiantesService: EstudiantesService,
    private BancosService: BancosService,
    private FormatosService: FormatosService,
    private PeriodoService: PeriodoService,
  ) {}

  ngOnInit() {
    this.PeriodoService.getPeriodos()
      .subscribe(periodos => {
        this.periodo = periodos[0].id_periodo;
        this.periodos = periodos;
      });

    this.arancelesConsultados([]);
  }

  public applyFilter = (event: Event): void => {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSources.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSources.paginator.firstPage();
    }
  }

  public openDialog = (estudiante: Estudiante): void => {
    const dialogRef = this.dialog.open(DialogSelection, {
      width: '500px',
      data: {
        cedula: estudiante.cedula,
        primer_nombre: estudiante.primer_nombre,
        segundo_nombre: estudiante.segundo_nombre,
        primer_apellido: estudiante.primer_apellido,
        segundo_apellido: estudiante.segundo_apellido,
        nombre_postgrado: estudiante.nombre_postgrado,
        nombre_carrera: estudiante.nombre_carrera,
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

  private arancelesConsultados = aranceles => {
    this.dataSources = new MatTableDataSource(aranceles);
    this.dataSources.paginator = this.paginator;
    this.dataSources.sort = this.sort;
  }

  public buscarEstudiante = (): void => {
    this.cargando = true;

    if (this.consultar) {
      this.ArancelesService.getPlanillas(this.cedula)
        .subscribe(planillas => {
          this.planillas = planillas;
          this.cargando = false;

          if (this.planillas.length != 0) {
            this.buscar = true;
            this.verArancel = false;
            this.verConsulta = true;

            this.arancelesConsultados(this.planillas)
          } else {
            this.buscar = false;
            const dialogRef = this.dialog.open(StatusDatosComponent, {
              width: '600px',
              data: {
                mensaje: `¡No se han encontrado resultados de planillas para ${this.cedula}!`,
                clase: 'error'
              }
            });
          }
        });
    } else {
      this.EstudiantesService.getEstudiante(this.cedula)
        .subscribe(estudiante => {
          this.cargando = false;

          if (estudiante.length > 0) {
            this.buscar = true;
            this.verConsulta = false;
            this.verArancel = true;
            this.dataSource = new MatTableDataSource(estudiante);
          } else {
            this.buscar = false;
            const dialogRef = this.dialog.open(StatusDatosComponent, {
              width: '600px',
              data: {
                mensaje: `¡No se ha encontrado ningun estudiante para ${this.cedula}!`,
                clase: 'error'
              }
            });
          }
        });
    }
  }

  public cargandoDatos = (valor: boolean): void => {
    this.cargando = false;
    this.buscar = valor;
  }

  public cancelar = (): void => {
    this.verPlanilla = false;
  }

  public recibirTotal = (valor: number): void => {
    this.total = valor;

    this.diferencia = this.banco - this.total;
  }

  public recibirTotalBanco = (valor: number): void => {
    this.banco = valor;

    this.diferencia = this.banco - this.total;
  }

  public procesarPlanilla = (valor: boolean): void => {
    if (valor) {
      this.generar = true;

      // Guardar arancel en base de datos
      this.ArancelesService.addPlanilla(this.total, this.banco, this.diferencia, this.cedula, this.periodo)
        .subscribe(result => {
          this.idArancel = result[0].id_planilla;
          this.fecha = `${result[0].dia}/${result[0].mes}/${result[0].anio}`;

          this.ArancelesService.addConceptos(this.idArancel)
            .subscribe(result => {
              if (result.insertId === 0) {
                this.BancosService.addReferencias(this.idArancel)
                  .subscribe(result => {
                    if (result.insertId === 0) {
                      // Si los datos fueron guardados satisfactoriamente, generar el PDF
                      this.generarPDF(1);

                      this.periodo = this.periodos[0].id_periodo;
                      this.cedula = null;
                      this.verPlanilla = false;
                      this.generar = false;
                      const dialogRef = this.dialog.open(StatusDatosComponent, {
                        width: '600px',
                        data: {
                          mensaje: '¡Datos guardados satisfactoriamente!',
                          clase: 'success'
                        }
                      });
                    }
                  })

              }
            })
        })
    }
  }

  public generarPDF = (valor: number): void => {
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
            {width: 80, bold: true, alignment: 'center', text: this.idArancel},
            {width: 80, bold: true, alignment: 'center', text: this.fecha}
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
            {width: 'auto', bold: true, alignment: 'right', text: `Cohorte: ${this.periodo}`, margin: [0, 20, 0, 10]},
          ]
        },
        {
          columns: [
            {width: '*', bold: true, text: `Cédula: ${this.estudiante.cedula}`},
            {width: '*', bold: true, text: `Nombre: ${this.estudiante.primer_nombre} ${this.estudiante.primer_apellido}`},
          ]
        },
        {
          columns: [
            {width: '*', bold: true, text: `Postgrado: ${this.estudiante.nombre_postgrado}`},
            {width: '*', bold: true, text: `Area: ${this.estudiante.nombre_carrera}`},
          ]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: this.mostrarConceptos(),
          }
        },
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

    switch (valor) {
      case 1: pdfMake.createPdf(planillaArancelesPDF).open();
        break;
      case 2: pdfMake.createPdf(planillaArancelesPDF).download(`${this.estudiante.cedula}-${this.idArancel}-(${this.periodo})`);
        break;
      case 3: pdfMake.createPdf(planillaArancelesPDF).print();
        break;
    };
  }

  private mostrarConceptos = (): any[] => {
    let listaConceptos = [];
    this.conceptos = this.ArancelesService.CONCEPTOS;

    listaConceptos.push([
      {text: 'Codigo', style: 'tableHeader', alignment: 'center'},
      {text: 'Concepto', style: 'tableHeader', alignment: 'center'},
      {text: 'Cant', style: 'tableHeader', alignment: 'center'},
      {text: 'Monto', style: 'tableHeader', alignment: 'center'},
      {text: 'Subtotal', style: 'tableHeader', alignment: 'center'}
    ])

    this.conceptos.forEach(concepto => {
      listaConceptos.push([
        {text: concepto.codigo, alignment: 'center'},
        concepto.descripcion,
        {text: this.FormatosService.formatearNumero(concepto.cantidad), alignment: 'right'},
        {text: this.FormatosService.formatearNumero(concepto.monto), alignment: 'right'},
        {text: this.FormatosService.formatearNumero(concepto.subtotal), alignment: 'right'}
      ])
    });

    listaConceptos.push([
      {text: '', border: [false,false,false,false]},
      {text: '', border: [false,false,false,false]},
      {text: '', border: [false,false,false,false]},
      {text: 'Total', alignment: 'right', style: 'tableHeader'},
      {text: this.FormatosService.formatearNumero(this.total), alignment: 'right', style: 'tableHeader'}
    ])

    return listaConceptos;
  }

  private mostrarReferencias = (): any[] => {
    let listaReferencias = [];
    this.referencias = this.BancosService.DATOS_BANCARIOS;

    listaReferencias.push([
      {text: 'DATOS BANCARIOS', alignment: 'center', style: 'tableHeader', colSpan: 4},
      {},
      {},
      {}
    ])

    listaReferencias.push([
      {text: 'Fecha', alignment: 'center', style: 'tableHeader'},
      {text: 'Banco', alignment: 'center', style: 'tableHeader'},
      {text: 'Referencia', alignment: 'center', style: 'tableHeader'},
      {text: 'Monto', alignment: 'center', style: 'tableHeader'}
    ])

    this.referencias.forEach(referencia => {
      listaReferencias.push([
        {text: this.FormatosService.formatearFecha(referencia.fecha), alignment: 'center'},
        referencia.banco,
        {text: referencia.referencia, alignment: 'right'},
        {text: this.FormatosService.formatearNumero(referencia.monto), alignment: 'right'}
      ])
    });

    return listaReferencias;
  }

  public verDatosPlanilla = (id: number): void => {
    this.ArancelesService.clearConceptos();
    this.BancosService.clearReferencias();
    this.generar = true;

    this.ArancelesService.getPlanilla(id)
      .subscribe(result => {
        this.estudiante = {
          cedula: result[0].cedula,
          primer_nombre: result[0].primer_nombre,
          segundo_nombre: result[0].segundo_nombre,
          primer_apellido: result[0].primer_apellido,
          segundo_apellido: result[0].segundo_apellido,
          nombre_carrera: result[0].nombre_carrera,
          nombre_postgrado: result[0].nombre_postgrado
        };
        this.periodo = result[0].id_periodo;
        this.idArancel = result[0].id_planilla;
        this.fecha = `${result[0].dia}/${result[0].mes}/${result[0].anio}`;
        this.total = result[0].total_conceptos;
        this.banco = result[0].total_banco;
        this.diferencia = result[0].diferencia_pago;

        this.ArancelesService.getConceptosPlanilla(id)
          .subscribe(result => {
            for (let i = 0; i < result.length; i++) {
              let conc = {
                codigo: result[i].codigo,
                descripcion: result[i].descripcion,
                monto: result[i].monto_planilla,
                cantidad: result[i].cantidad,
                subtotal: result[i].sub_total
              }
              this.ArancelesService.nuevoConcepto(conc);
            }
            this.BancosService.getReferenciasPlanilla(id)
              .subscribe(result => {
                for (let i = 0; i < result.length; i++) {
                  let ref = {
                    id: 0,
                    fecha: result[i].fecha,
                    banco: result[i].nombre_banco,
                    referencia: result[i].valor_referencia,
                    monto: result[i].monto
                  }
                  this.BancosService.addReferencia(ref);
                }

                this.verPlanilla = true;
                this.generar = false;
              })
          })
      })
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

  public onNoClick = (): void => {
    this.dialogRef.close();
  }

}
