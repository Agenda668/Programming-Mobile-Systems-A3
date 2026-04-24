import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSpinner,
  ToastController,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { refreshOutline, searchOutline } from 'ionicons/icons';
import { PageShellComponent } from '../../components/page-shell.component';
import { Category, InventoryItem, StockStatus } from '../../models/inventory.model';

@Component({
  selector: 'app-list-page',
  standalone: true,
  imports: [
    FormsModule,
    PageShellComponent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonBadge,
    IonChip,
    IonNote,
  ],
  template: `
    <app-page-shell title="库存列表">
      <ion-refresher slot="fixed" (ionRefresh)="onRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-searchbar
        [(ngModel)]="searchText"
        placeholder="按名称搜索库存"
        (ionInput)="filterItems()"
        show-clear-button="focus"
      ></ion-searchbar>

      <ion-button expand="block" fill="outline" class="ion-margin-bottom" (click)="reload()">
        <ion-icon slot="start" [icon]="refreshOutline"></ion-icon>
        刷新数据
      </ion-button>

      @if (loading) {
        <div class="loading-box">
          <ion-spinner name="crescent"></ion-spinner>
          <p>正在加载库存数据...</p>
        </div>
      } @else {
        <ion-list lines="none">
          @for (item of filteredItems; track item.id) {
            <ion-card>
              <ion-card-header>
                <ion-card-subtitle>商品 ID: {{ item.id }}</ion-card-subtitle>
                <ion-card-title>{{ item.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-item lines="none">
                  <ion-label>
                    <h3>分类</h3>
                    <p>{{ item.category }}</p>
                  </ion-label>
                  <ion-chip slot="end" [color]="statusColor(item.status)">
                    <ion-label>{{ item.status }}</ion-label>
                  </ion-chip>
                </ion-item>
                <ion-item lines="none">
                  <ion-label>
                    <h3>数量</h3>
                    <p>{{ item.quantity }}</p>
                  </ion-label>
                  <ion-label slot="end">
                    <h3>价格</h3>
                    <p>$ {{ item.price }}</p>
                  </ion-label>
                </ion-item>
                <ion-item lines="none">
                  <ion-label>
                    <h3>供应商</h3>
                    <p>{{ item.supplier }}</p>
                  </ion-label>
                  <ion-badge slot="end" color="tertiary">
                    {{ item.featured ? '精选' : '普通' }}
                  </ion-badge>
                </ion-item>
                @if (item.note) {
                  <ion-note>{{ item.note }}</ion-note>
                }
              </ion-card-content>
            </ion-card>
          }
        </ion-list>

        @if (!filteredItems.length) {
          <div class="empty-box">
            <p>没有找到匹配的库存记录。</p>
          </div>
        }
      }
    </app-page-shell>
  `,
  styles: [
    `
      .loading-box,
      .empty-box {
        display: flex;
        min-height: 40vh;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 12px;
        color: var(--ion-color-medium);
      }
    `,
  ],
})
export class ListPagePage implements OnInit {
  readonly refreshOutline = refreshOutline;
  readonly searchOutline = searchOutline;

  searchText = '';
  loading = false;
  filteredItems: InventoryItem[] = [];
  private readonly items: InventoryItem[] = [
    {
      id: 1,
      name: 'Laptop',
      category: Category.Electronics,
      quantity: 12,
      price: 899,
      supplier: 'TechWorld',
      status: StockStatus.InStock,
      featured: true,
      note: '服务器默认保留商品',
    },
    {
      id: 2,
      name: 'Office Chair',
      category: Category.Furniture,
      quantity: 5,
      price: 149,
      supplier: 'FurniMax',
      status: StockStatus.LowStock,
      featured: false,
    },
    {
      id: 3,
      name: 'Hammer',
      category: Category.Tools,
      quantity: 0,
      price: 25,
      supplier: 'ToolHub',
      status: StockStatus.OutOfStock,
      featured: false,
    },
  ];

  constructor(private readonly toastController: ToastController) {}

  ngOnInit(): void {
    this.loadItems();
  }

  async loadItems(message = '库存数据已刷新') {
    this.loading = true;
    await this.delay(500);
    this.filteredItems = this.filterByText(this.searchText);
    this.loading = false;
    await this.presentToast(message);
  }

  filterItems(): void {
    this.filteredItems = this.filterByText(this.searchText);
  }

  async reload(): Promise<void> {
    await this.loadItems();
  }

  async onRefresh(event: RefresherCustomEvent): Promise<void> {
    await this.loadItems('下拉刷新完成');
    event.target.complete();
  }

  statusColor(status: StockStatus): string {
    switch (status) {
      case StockStatus.InStock:
        return 'success';
      case StockStatus.LowStock:
        return 'warning';
      case StockStatus.OutOfStock:
        return 'danger';
      default:
        return 'medium';
    }
  }

  private filterByText(text: string): InventoryItem[] {
    const keyword = text.trim().toLowerCase();
    if (!keyword) {
      return [...this.items];
    }
    return this.items.filter((item) => item.name.toLowerCase().includes(keyword));
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1200,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
