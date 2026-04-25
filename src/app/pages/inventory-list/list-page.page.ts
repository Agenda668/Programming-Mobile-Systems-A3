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
import { refreshOutline } from 'ionicons/icons';
import { PageShellComponent } from '../../components/page-shell.component';
import { InventoryItem, StockStatus } from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';

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
  templateUrl: './list-page.page.html',
  styleUrls: ['./list-page.page.scss'],
})
export class ListPagePage implements OnInit {
  readonly refreshOutline = refreshOutline;

  searchText = '';
  loading = false;
  filteredItems: InventoryItem[] = [];
  private allItems: InventoryItem[] = [];

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  async loadItems(message = '库存数据已刷新') {
    this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: async (items) => {
        this.allItems = items;
        this.filteredItems = this.filterByText(this.searchText);
        this.loading = false;
        await this.presentToast(message);
      },
      error: async () => {
        this.loading = false;
        await this.presentToast('库存数据加载失败', 'danger');
      },
    });
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
      return [...this.allItems];
    }
    return this.allItems.filter((item) => item.name.toLowerCase().includes(keyword));
  }

  private async presentToast(message: string, color: 'dark' | 'danger' = 'dark'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1200,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
