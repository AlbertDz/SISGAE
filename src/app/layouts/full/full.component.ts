import * as $ from 'jquery';
import { MediaMatcher } from '@angular/cdk/layout';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import {
  ChangeDetectorRef,
  Component,
  NgZone,
  ViewChild,
  HostListener,
  Directive,
  AfterViewInit,
  Input,
  OnDestroy,
  Inject
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MenuItems } from '../../shared/menu-items/menu-items';
import { AppHeaderComponent } from './header/header.component';
import { AppSidebarComponent } from './sidebar/sidebar.component';

/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;
  public isSpinnerVisible = true;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
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
    });
  }

  public ngOnDestroy = (): void => {
    this.isSpinnerVisible = false;
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  
  ngAfterViewInit() {}
}
