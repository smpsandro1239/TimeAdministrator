import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogConfigService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  getResponsiveConfig(baseConfig: Partial<MatDialogConfig> = {}): MatDialogConfig {
    const isMobile = this.breakpointObserver.isMatched('(max-width: 768px)');
    const isSmallMobile = this.breakpointObserver.isMatched('(max-width: 480px)');

    if (isSmallMobile) {
      return {
        ...baseConfig,
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        maxHeight: 'none',
        panelClass: ['responsive-dialog', 'mobile-fullscreen']
      };
    }

    if (isMobile) {
      return {
        ...baseConfig,
        width: '95vw',
        maxHeight: '90vh',
        panelClass: ['responsive-dialog', 'mobile-dialog']
      };
    }

    return {
      ...baseConfig,
      width: baseConfig.width || '600px',
      maxWidth: baseConfig.maxWidth || '90vw',
      maxHeight: '90vh',
      panelClass: ['responsive-dialog']
    };
  }
}