import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PerfilComponent } from '../../../modals/perfil/perfil.component';
import { ConfigComponent } from '../../../modals/config/config.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements OnInit {

	constructor(
		private router: Router,
		private cookie: CookieService,
		public dialog: MatDialog,
	) {}

	ngOnInit() {}

	closeSesion() {
		this.cookie.delete('token');
		localStorage.removeItem('acceso');
		localStorage.removeItem('idUser')
		this.router.navigate(['/login']);
	}

	public openPerfil() {
	    const dialogRef = this.dialog.open(PerfilComponent, {
	      width: '800px',
	    });
	}

	public openConfig() {
	    const dialogRef = this.dialog.open(ConfigComponent, {
	      width: '800px',
	    });
	}
}

