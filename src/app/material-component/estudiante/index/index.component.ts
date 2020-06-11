import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationsService } from '../../../services/validaciones/validations.service';
import { MyValidations } from '../../../utils/my-validations';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  myForm: FormGroup;

  constructor(
  	private formBuilder: FormBuilder,
    private validationsService: ValidationsService,
  ) { }

  ngOnInit() {
  	this.myForm = this.formBuilder.group({
      cedula: ['', [Validators.required, Validators.min(999999)], MyValidations.validarEstudiante(this.validationsService)]
    });
  }

}
