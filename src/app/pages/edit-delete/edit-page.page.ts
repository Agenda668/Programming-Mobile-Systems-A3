import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  ToastController,
} from '@ionic/angular/standalone';
import { PageShellComponent } from '../../components/page-shell.component';
import {
  CATEGORY_OPTIONS,
  Category,
  InventoryItem,
  STOCK_STATUS_OPTIONS,
  StockStatus,
} from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageShellComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonText,
    IonRow,
    IonCol,
  ],
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {
  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly stockStatusOptions = STOCK_STATUS_OPTIONS;
  lookupName = '';
  currentItem: InventoryItem | null = null;
  loading = false;
  private allItems: InventoryItem[] = [];

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    category: [Category.Electronics, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    price: [1, [Validators.required, Validators.min(1)]],
    supplier: ['', [Validators.required]],
    status: [StockStatus.InStock, [Validators.required]],
    note: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly inventoryService: InventoryService,
    private readonly toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.loadAllItems();
  }

  loadAllItems(): void {
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.allItems = items;
        if (this.currentItem) {
          const refreshed = items.find((item) => item.name.trim().toLowerCase() === this.currentItem?.name.trim().toLowerCase());
          if (refreshed) {
            this.currentItem = refreshed;
          }
        }
      },
      error: () => void this.showToast('无法加载库存列表', 'warning'),
    });
  }

  loadByName(): void {
    const name = this.lookupName.trim().toLowerCase();
    if (!name) {
      void this.showToast('请输入名称后再查询', 'warning');
      return;
    }

    const found = this.allItems.find((item) => item.name.trim().toLowerCase() === name);
    if (!found) {
      this.currentItem = null;
      this.form.reset({
        name: '',
        category: Category.Electronics,
        quantity: 1,
        price: 1,
        supplier: '',
        status: StockStatus.InStock,
        note: '',
      });
      void this.showToast('未找到该库存，请确认名称是否存在', 'danger');
      return;
    }

    this.currentItem = found;
    this.form.setValue({
      name: found.name,
      category: found.category,
      quantity: found.quantity,
      price: found.price,
      supplier: found.supplier,
      status: found.status,
      note: found.note ?? '',
    });
    void this.showToast('已加载库存信息', 'success');
  }

  save(): void {
    if (!this.currentItem) {
      void this.showToast('请先查询并选中一个存在的库存', 'warning');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.loading = true;
    this.inventoryService
      .update(this.currentItem.name, {
        name: value.name.trim(),
        category: value.category,
        quantity: Number(value.quantity),
        price: Number(value.price),
        supplier: value.supplier.trim(),
        status: value.status,
        note: value.note?.trim() || undefined,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: async (item) => {
          this.currentItem = item;
          this.lookupName = item.name;
          this.loadAllItems();
          await this.showToast('修改成功', 'success');
        },
        error: async () => {
          await this.showToast('修改失败，请检查接口或名称是否允许修改', 'danger');
        },
      });
  }

  remove(): void {
    if (!this.currentItem) {
      void this.showToast('请先查询并选中一个存在的库存', 'warning');
      return;
    }
    if (this.currentItem.name === 'Laptop') {
      void this.showToast('Laptop 禁止删除', 'warning');
      return;
    }

    this.loading = true;
    this.inventoryService
      .delete(this.currentItem.name)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: async () => {
          await this.showToast('删除成功', 'success');
          this.currentItem = null;
          this.lookupName = '';
          this.loadAllItems();
          this.form.reset({
            name: '',
            category: Category.Electronics,
            quantity: 1,
            price: 1,
            supplier: '',
            status: StockStatus.InStock,
            note: '',
          });
        },
        error: async () => {
          await this.showToast('删除失败，请检查接口异常或删除约束', 'danger');
        },
      });
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
