import { Component, OnInit,Inject } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationsService } from '../../services/validaciones/validations.service';
import { MyValidations } from '../../utils/my-validations';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {

  pregunta: string;
  respuesta: string;
  primerFormGroup: FormGroup;
  segundoFormGroup: FormGroup;
  tercerFormGroup: FormGroup;

  constructor(
  	public dialogRef: MatDialogRef<RecoverComponent>,
  	private _formBuilder: FormBuilder,
    private validationsService: ValidationsService,
  ) { }

  ngOnInit() {
  	this.primerFormGroup = this._formBuilder.group({
      cedula: ['', [Validators.required, Validators.min(999999)], MyValidations.validateUser(this.validationsService)]
    });
    this.segundoFormGroup = this._formBuilder.group({
      respuesta: ['', Validators.required]
    }, this.respuestaValidator);
    this.tercerFormGroup = this._formBuilder.group({
      newPass: ['', [Validators.required, Validators.minLength(8)]],
      repeatPass: ['', [Validators.required, Validators.minLength(8)]]
    }, this.passwordMatchValidator);

    this.validationsService.customPregunta.subscribe(pregunta => this.pregunta = pregunta);
    this.validationsService.customRespuesta.subscribe(respuesta => this.respuesta = respuesta);
  }

  public passwordMatchValidator = (g: FormGroup): any => {
    return g.get('newPass').value === g.get('repeatPass').value
      ? null : {'mismatch': true};
  }

  public respuestaValidator = (g: FormGroup): any => {
    return (g.get('respuest').value === this.respuesta) ?null :{'response': true}; 
  }

}
