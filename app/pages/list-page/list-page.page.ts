import { Component } from '@angular/core';
import { PageShellComponent } from '../../components/page-shell.component';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [PageShellComponent],
  template: `<app-page-shell title="库存列表">库存列表与搜索功能占位。</app-page-shell>`,
})
export class ListPagePage {}
