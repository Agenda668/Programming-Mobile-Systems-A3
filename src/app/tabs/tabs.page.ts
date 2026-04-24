import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addOutline, listOutline, createOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
  template: `
    <ion-tabs class="app-tabs">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" class="app-tab-bar" translucent="false">
        <ion-tab-button tab="list" href="/tabs/list">
          <ion-icon [icon]="listOutline"></ion-icon>
          <ion-label>库存列表</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="add" href="/tabs/add">
          <ion-icon [icon]="addOutline"></ion-icon>
          <ion-label>添加精选</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="edit" href="/tabs/edit">
          <ion-icon [icon]="createOutline"></ion-icon>
          <ion-label>修改删除</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="privacy" href="/tabs/privacy">
          <ion-icon [icon]="shieldCheckmarkOutline"></ion-icon>
          <ion-label>隐私安全</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage {
  readonly addOutline = addOutline;
  readonly listOutline = listOutline;
  readonly createOutline = createOutline;
  readonly shieldCheckmarkOutline = shieldCheckmarkOutline;
}
