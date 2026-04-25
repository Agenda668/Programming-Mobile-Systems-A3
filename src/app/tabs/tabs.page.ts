import { Component } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addOutline, listOutline, createOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  readonly addOutline = addOutline;
  readonly listOutline = listOutline;
  readonly createOutline = createOutline;
  readonly shieldCheckmarkOutline = shieldCheckmarkOutline;
}
