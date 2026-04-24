import { Component, input } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent } from '@ionic/angular/standalone';
import { helpCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ title() }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="showHelp()">
            <ion-icon [icon]="helpCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ng-content></ng-content>
    </ion-content>
  `,
})
export class PageShellComponent {
  readonly title = input('');
  readonly helpCircleOutline = helpCircleOutline;
  showHelp() {
    alert('请根据页面提示完成库存管理操作。');
  }
}
