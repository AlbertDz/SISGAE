import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {Banco} from '../../services/bancos/banco';
import {BancosService} from '../../services/bancos/bancos.service';
import {DatosReferencia} from '../../services/bancos/referencia';
import {MatTableDataSource} from '@angular/material/table';

import {OpcionConceptoComponent} from '../../modals/opcion-concepto/opcion-concepto.component';

const DATOS_BANCARIOS: DatosReferencia[] = [];

@Component({
  selector: 'app-datos-bancarios',
  templateUrl: './datos-bancarios.component.html',
  styleUrls: ['./datos-bancarios.component.css']
})
export class DatosBancariosComponent implements OnInit {

  montoBanco: number = 0.00;

  displayedDatosBancarios: string[] = ['fecha', 'banco', 'referencia', 'monto', 'borrar'];
  datosBancarios: MatTableDataSource<DatosReferencia>;

  @Input() montoTotal: number;
  @Input() montoDiferencia: number;
  @Output() totalBanco = new EventEmitter<number>();
  @Output() procesar = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    private BancosService: BancosService,
  ) { }

  ngOnInit() {
    this.datosBancarios = new MatTableDataSource(this.BancosService.DATOS_BANCARIOS);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(Referencia, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null ) {
        this.BancosService.addReferencia(result);

        this.datosBancarios._updateChangeSubscription();

        this.montoBanco += result.monto;
        this.enviarTotal(this.montoBanco);
      }
    });
  }

  borrar(referencia: DatosReferencia): void {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: `¿Desea borrar la referencia "${referencia.referencia}" de la lista?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result != null) {
        this.montoBanco -= referencia.monto;
        this.enviarTotal(this.montoBanco);

        this.BancosService.deleteReferencia(referencia);

        this.datosBancarios._updateChangeSubscription();
      }

    });
  }

  enviarTotal(valor: number) {
    this.totalBanco.emit(valor);
  }

  procesarPlanilla(): void {
    const dialogRef = this.dialog.open(OpcionConceptoComponent, {
      width: '400px',
      data: {
        mensaje: 'Antes de continuar verifique que todos los datos sean correctos.\n\n ¿Desea continuar?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null){
        this.procesar.emit(true);
      }
    });
  }

}

@Component({
  selector: 'referencia',
  templateUrl: './referencia.html'
})
export class Referencia implements OnInit {

  myForm: FormGroup;

  bancos: Banco[] = [];
  datos: DatosReferencia;
  banco: string;

  myControl = new FormControl();
  filteredOptions: Observable<Banco[]>;

  constructor(
    public dialogRef: MatDialogRef<Referencia>,
    private BancosService: BancosService,
    public FormBuilder: FormBuilder,
    private _snackBar: MatSnackBar
  ) {
    this.myForm = new FormGroup({
      fecha: new FormControl( null , Validators.required ),
      referencia: new FormControl( null , Validators.required ),
      monto: new FormControl( null , Validators.required ),
    });
  }

  ngOnInit() {
    this.getBancos();
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
    );
  }

  private _filter(value: string): Banco[] {
    const filterValue = value.toLowerCase();

    return this.bancos.filter(option => option.nombre_banco.toLowerCase().includes(filterValue));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  enviarDatos() {
    if((this.myForm.invalid) && (this.banco != '')) {
      this._snackBar.open('¡Debe llenar todos los campos!', '', {
        duration: 3000,
      });
    } else {
      this.datos = {
        fecha: this.myForm.value.fecha,
        banco: this.banco,
        referencia: this.myForm.value.referencia,
        monto: this.myForm.value.monto,
      }
      this.dialogRef.close(this.datos);
    }
  }

  getBancos() {
    this.BancosService.getBancos()
      .subscribe(bancos => this.bancos = bancos);
  }

}