import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SesionCloseService implements CanActivate {

  constructor(
    private router: Router,
    private cookie: CookieService,
  ) { }

  canActivate(): boolean {
    if ( this.cookie.get('token') ) {
      alert('¡Debe cerrar sesión!');
      this.router.navigate(['/inicio']);
      return false;
    } else {
      return true;
    }
  }
}