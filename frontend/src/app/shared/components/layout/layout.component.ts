import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MobileNavComponent
  ],
  template: `
    <div class="layout-wrapper">
      <app-sidebar *ngIf="!(isMobile$ | async)"></app-sidebar>
      <main class="main-content" [class.mobile]="isMobile$ | async">
        <ng-content></ng-content>
      </main>
      <app-mobile-nav></app-mobile-nav>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
    }

    .layout-wrapper {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .main-content.mobile {
      padding-bottom: 100px;
    }

    @media (max-width: 768px) {
      .layout-wrapper {
        flex-direction: column;
      }
    }
  `]
})
export class LayoutComponent {
  isMobile$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }
}
