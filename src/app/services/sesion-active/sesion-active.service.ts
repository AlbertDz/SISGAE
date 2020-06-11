import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SesionActiveService implements CanActivate {

  constructor(
    private router: Router,
    private cookie: CookieService,
  ) { }

  canActivate(): boolean {
    if ( this.cookie.get('token') && localStorage.getItem('acceso') && localStorage.getItem('idUser') ) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
