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
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  Category,
  InventoryCreatePayload,
  InventoryItem,
  STOCK_STATUS_LABELS,
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
  templateUrl: './add-page.page.html',
  styleUrls: ['./add-page.page.scss'],
})
export class AddPagePage implements OnInit {
  readonly categoryOptions = CATEGORY_OPTIONS;
  readonly stockStatusOptions = STOCK_STATUS_OPTIONS;
  readonly categoryLabels = CATEGORY_LABELS;
  readonly stockStatusLabels = STOCK_STATUS_LABELS;
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
