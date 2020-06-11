import {
  Component,
  Input,
  OnDestroy,
  Inject
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
	public isSpinnerVisible = true;

	constructor(
		private router: Router,
    	@Inject(DOCUMENT) private document: Document
	) {
		this.router.events.subscribe(event => {
		        if (event instanceof NavigationStart) {
		          this.isSpinnerVisible = true;
		        } else if (
		          event instanceof NavigationEnd ||
		          event instanceof NavigationCancel ||
		          event instanceof NavigationError
		        ) {
		          this.isSpinnerVisible = false;
		        }
		    }, () => {
		        this.isSpinnerVisible = false;
		    }
	    );
	}

	public ngOnDestroy = (): void => {
	    this.isSpinnerVisible = false;
	}
}
