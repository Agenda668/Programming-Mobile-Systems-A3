import { Component } from '@angular/core';
import { PageShellComponent } from '../../components/page-shell.component';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [PageShellComponent],
  template: `<app-page-shell title="修改删除">修改删除库存占位。</app-page-shell>`,
})
export class EditPagePage {}
