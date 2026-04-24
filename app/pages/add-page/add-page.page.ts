import { Component } from '@angular/core';
import { PageShellComponent } from '../../components/page-shell.component';

@Component({
  selector: 'app-add-page',
  standalone: true,
  imports: [PageShellComponent],
  template: `<app-page-shell title="添加精选">添加库存与精选列表占位。</app-page-shell>`,
})
export class AddPagePage {}
