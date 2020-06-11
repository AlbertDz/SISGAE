import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SesionAnalistaService implements CanActivate {

  constructor(
    private router: Router,
  ) { }

  canActivate(): boolean {
    if ( localStorage.getItem('acceso') === '0' ) {
      return true;
    } else {
      this.router.navigate(['/inicio']);
      return false;
    }
  }
}
