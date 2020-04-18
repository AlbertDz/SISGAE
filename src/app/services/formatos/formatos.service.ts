import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatosService {

  constructor() { }

  formatearNumero(valor: number): string {
    let numero = valor.toFixed(2);
    let numeroString = numero.toString();
    let nuevoValor = numeroString.replace('.', ',');
    let longitudTres = numeroString.indexOf('.') - 3;

    while (longitudTres > 0) {
      nuevoValor = `${nuevoValor.slice(0, longitudTres)}.${nuevoValor.slice(longitudTres)}`;
      numeroString = nuevoValor;

      longitudTres = numeroString.indexOf('.') - 3;
    }

    return nuevoValor;
  }

  formatearFecha(fecha: string): string {
  	let nuevaFecha = `${fecha.slice(8)}/${fecha.slice(5, 7)}/${fecha.slice(0, 4)}`;

  	return nuevaFecha;
  }
}
