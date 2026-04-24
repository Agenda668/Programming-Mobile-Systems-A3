import { Component } from '@angular/core';
import { PageShellComponent } from '../../components/page-shell.component';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [PageShellComponent],
  template: `<app-page-shell title="隐私安全">隐私安全说明占位。</app-page-shell>`,
})
export class PrivacyPagePage {}
