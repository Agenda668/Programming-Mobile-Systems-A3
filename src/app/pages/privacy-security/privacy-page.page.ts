import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { PageShellComponent } from '../../components/page-shell.component';

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  imports: [PageShellComponent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel],
  templateUrl: './privacy-page.page.html',
  styleUrls: ['./privacy-page.page.scss'],
})
export class PrivacyPagePage {}
