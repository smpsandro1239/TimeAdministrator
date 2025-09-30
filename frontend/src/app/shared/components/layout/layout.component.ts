import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MobileNavComponent
  ],
  template: `
    <div class="layout">
      <app-sidebar *ngIf="!(isMobile$ | async)"></app-sidebar>
      <main class="main-content" [class.mobile]="isMobile$ | async">
        <router-outlet></router-outlet>
      </main>
      <app-mobile-nav></app-mobile-nav>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      background: #f5f5f5;
    }

    .main-content.mobile {
      padding-bottom: 80px;
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