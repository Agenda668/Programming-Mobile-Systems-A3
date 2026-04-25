import { Component, input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular/standalone';
import { helpCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent],
  templateUrl: './page-shell.component.html',
  styleUrls: ['./page-shell.component.scss'],
})
export class PageShellComponent {
  readonly title = input('');
  readonly helpCircleOutline = helpCircleOutline;

  showHelp(): void {
    alert('请根据页面提示完成库存管理操作。');
  }
}
