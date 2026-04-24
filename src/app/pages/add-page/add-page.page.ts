import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
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
  InventoryCreatePayload,
  InventoryItem,
  STOCK_STATUS_OPTIONS,
  StockStatus,
} from '../../models/inventory.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageShellComponent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonButton,
    IonText,
    IonBadge,
    IonList,
    IonNote,
  ],
  template: `
    <app-page-shell title="添加精选">
      <ion-card>
        <ion-card-header>
          <ion-card-title>新增库存</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <ion-grid>
              <ion-row>
                <ion-col size="12">
                  <ion-item>
                    <ion-label position="stacked">名称 *</ion-label>
                    <ion-input formControlName="name" placeholder="请输入唯一商品名称"></ion-input>
                  </ion-item>
                  <ion-text color="danger" *ngIf="form.controls.name.touched && form.controls.name.invalid">
                    <small *ngIf="form.controls.name.errors?.['required']">名称必填</small>
                    <small *ngIf="form.controls.name.errors?.['duplicateName']">名称已存在</small>
                  </ion-text>
                </ion-col>

                <ion-col size="12" sizeMd="6">
                  <ion-item>
                    <ion-label position="stacked">分类 *</ion-label>
                    <ion-select formControlName="category" placeholder="请选择分类">
                      <ion-select-option *ngFor="let category of categoryOptions" [value]="category">{{ category }}</ion-select-option>
                    </ion-select>
                  </ion-item>
                </ion-col>

                <ion-col size="12" sizeMd="6">
                  <ion-item>
                    <ion-label position="stacked">库存状态 *</ion-label>
                    <ion-select formControlName="status" placeholder="请选择状态">
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
                    <ion-label>精选商品</ion-label>
                    <ion-checkbox slot="end" formControlName="featured"></ion-checkbox>
                  </ion-item>
                </ion-col>

                <ion-col size="12">
                  <ion-item>
                    <ion-label position="stacked">备注</ion-label>
                    <ion-input formControlName="note" placeholder="可选"></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>

            <ion-button expand="block" type="submit" [disabled]="loading || form.invalid">
              {{ loading ? '提交中...' : '新增库存' }}
            </ion-button>
          </form>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>精选商品</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item *ngFor="let item of featuredItems">
              <ion-label>
                <h3>{{ item.name }}</h3>
                <p>{{ item.category }} · {{ item.supplier }}</p>
              </ion-label>
              <ion-badge color="success">精选</ion-badge>
            </ion-item>
            <ion-item *ngIf="!featuredItems.length">
              <ion-label>当前没有精选商品</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </app-page-shell>
  `,
})
export class AddPagePage implements OnInit {
  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly stockStatusOptions = STOCK_STATUS_OPTIONS;
  featuredItems: InventoryItem[] = [];
  loading = false;
  private allNames = new Set<string>();

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    category: [Category.Electronics, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(1)]],
    price: [1, [Validators.required, Validators.min(1)]],
    supplier: ['', [Validators.required]],
    status: [StockStatus.InStock, [Validators.required]],
    featured: [false],
    note: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly inventoryService: InventoryService,
    private readonly toastController: ToastController,
  ) {}

  ngOnInit(): void {
    this.loadFeatured();
    this.inventoryService.getAll().subscribe({
      next: (items) =>
        (this.allNames = new Set(
          items
            .map((item) => item.name)
            .filter((name): name is string => !!name)
            .map((name) => name.toLowerCase()),
        )),
      error: () => this.showToast('无法读取名称列表，唯一性校验将仅做本地检查。', 'warning'),
    });
    this.form.controls.name.valueChanges.subscribe((value) => {
      const normalized = (value ?? '').trim().toLowerCase();
      const duplicate = normalized.length > 0 && this.allNames.has(normalized);
      if (duplicate) {
        this.form.controls.name.setErrors({ duplicateName: true });
      } else if (this.form.controls.name.hasError('duplicateName')) {
        this.form.controls.name.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }
    });
  }

  loadFeatured(): void {
    this.inventoryService.getAll().subscribe({
      next: (items) => {
        this.featuredItems = items.filter((item) => item.featured);
      },
      error: () => this.showToast('获取精选商品失败', 'danger'),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: InventoryCreatePayload = {
      name: value.name.trim(),
      category: value.category,
      quantity: Number(value.quantity),
      price: Number(value.price),
      supplier: value.supplier.trim(),
      status: value.status,
      featured: value.featured,
      note: value.note?.trim() || undefined,
    };

    this.loading = true;
    this.inventoryService
      .create(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: async () => {
          await this.showToast('库存新增成功', 'success');
          this.form.reset({
            name: '',
            category: Category.Electronics,
            quantity: 1,
            price: 1,
            supplier: '',
            status: StockStatus.InStock,
            featured: false,
            note: '',
          });
          this.loadFeatured();
        },
        error: async () => {
          await this.showToast('新增失败，请检查名称是否重复或接口是否异常', 'danger');
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
