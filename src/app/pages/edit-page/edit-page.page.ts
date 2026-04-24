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
  template: `
    <app-page-shell title="修改删除">
      <ion-card>
        <ion-card-header>
          <ion-card-title>按名称查询库存</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">请输入库存名称</ion-label>
            <ion-input [(ngModel)]="lookupName" [ngModelOptions]="{ standalone: true }" placeholder="例如 Laptop"></ion-input>
          </ion-item>
          <ion-button expand="block" (click)="loadByName()" [disabled]="loading">{{ loading ? '查询中...' : '查找库存' }}</ion-button>
        </ion-card-content>
      </ion-card>

      <ion-card *ngIf="currentItem">
        <ion-card-header>
          <ion-card-title>编辑库存信息</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form [formGroup]="form" (ngSubmit)="save()">
            <ion-row>
              <ion-col size="12">
                <ion-item>
                  <ion-label position="stacked">名称 *</ion-label>
                  <ion-input formControlName="name"></ion-input>
                </ion-item>
                <ion-text color="danger" *ngIf="form.controls.name.touched && form.controls.name.invalid">
                  <small *ngIf="form.controls.name.errors?.['required']">名称必填</small>
                </ion-text>
              </ion-col>

              <ion-col size="12" sizeMd="6">
                <ion-item>
                  <ion-label position="stacked">分类 *</ion-label>
                  <ion-select formControlName="category">
                    <ion-select-option *ngFor="let category of categoryOptions" [value]="category">{{ category }}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>

              <ion-col size="12" sizeMd="6">
                <ion-item>
                  <ion-label position="stacked">库存状态 *</ion-label>
                  <ion-select formControlName="status">
                    <ion-select-option *ngFor="let status of stockStatusOptions" [value]="status">{{ status }}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>

              <ion-col size="12" sizeMd="6">
                <ion-item>
                  <ion-label position="stacked">数量 *</ion-label>
                  <ion-input type="number" formControlName="quantity"></ion-input>
                </ion-item>
              </ion-col>

              <ion-col size="12" sizeMd="6">
                <ion-item>
                  <ion-label position="stacked">价格 *</ion-label>
                  <ion-input type="number" formControlName="price"></ion-input>
                </ion-item>
              </ion-col>

              <ion-col size="12">
                <ion-item>
                  <ion-label position="stacked">供应商 *</ion-label>
                  <ion-input formControlName="supplier"></ion-input>
                </ion-item>
              </ion-col>

              <ion-col size="12">
                <ion-item>
                  <ion-label position="stacked">备注</ion-label>
                  <ion-input formControlName="note"></ion-input>
                </ion-item>
              </ion-col>
            </ion-row>

            <ion-button expand="block" type="submit" [disabled]="loading">{{ loading ? '保存中...' : '保存修改' }}</ion-button>
          </form>
        </ion-card-content>
      </ion-card>

      <ion-card *ngIf="currentItem">
        <ion-card-header>
          <ion-card-title>删除库存</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>当前库存：{{ currentItem.name }}</p>
          <ion-text color="danger">注意：禁止删除 Laptop。</ion-text>
          <ion-button expand="block" color="danger" (click)="remove()" [disabled]="loading">
            {{ loading ? '删除中...' : '删除当前库存' }}
          </ion-button>
        </ion-card-content>
      </ion-card>
    </app-page-shell>
  `,
})
export class EditPagePage implements OnInit {
  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly stockStatusOptions = STOCK_STATUS_OPTIONS;
  lookupName = '';
  currentItem: InventoryItem | null = null;
  loading = false;

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
    this.inventoryService.getAll().subscribe({
      error: () => void this.showToast('无法加载库存列表', 'warning'),
    });
  }

  loadByName(): void {
    const name = this.lookupName.trim();
    if (!name) {
      void this.showToast('请输入名称后再查询', 'warning');
      return;
    }

    this.loading = true;
    this.inventoryService
      .getByName(name)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (item) => {
          this.currentItem = item;
          this.form.setValue({
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            price: item.price,
            supplier: item.supplier,
            status: item.status,
            note: item.note ?? '',
          });
          void this.showToast('已加载库存信息', 'success');
        },
        error: () => void this.showToast('未找到对应库存或接口异常', 'danger'),
      });
  }

  save(): void {
    if (!this.currentItem) {
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
          await this.showToast('修改成功', 'success');
        },
        error: async () => {
          await this.showToast('修改失败，请检查接口或名称是否允许修改', 'danger');
        },
      });
  }

  remove(): void {
    if (!this.currentItem) {
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
