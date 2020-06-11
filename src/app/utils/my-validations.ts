import { AbstractControl } from '@angular/forms';
import { ValidationsService } from '../services/validaciones/validations.service';

export class MyValidations {
	static validateUser = (validationsService: ValidationsService) => {
		return (control: AbstractControl) => {
			const value = control.value;
			return validationsService.validateUser(value);
		}
	}

	static validarEstudiante = (validationsService: ValidationsService) => {
		return (control: AbstractControl) => {
			const value = control.value;
			return validationsService.validarEstudiante(value);
		}
	}
}