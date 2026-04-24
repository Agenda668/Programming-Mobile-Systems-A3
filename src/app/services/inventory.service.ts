import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InventoryCreatePayload, InventoryItem, InventoryUpdatePayload } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.baseUrl}/`);
  }

  getByName(name: string): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(`${this.baseUrl}/${encodeURIComponent(name)}`);
  }

  create(item: InventoryCreatePayload): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.baseUrl}/`, item);
  }

  update(name: string, item: InventoryUpdatePayload): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.baseUrl}/${encodeURIComponent(name)}`, item);
  }

  delete(name: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${encodeURIComponent(name)}`);
  }
}
