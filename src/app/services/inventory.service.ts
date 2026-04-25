import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import {
  InventoryApiItem,
  InventoryApiPayload,
  InventoryCreatePayload,
  InventoryItem,
  InventoryUpdatePayload,
  mapApiItemToInventoryItem,
  mapInventoryCreateToApiPayload,
  mapInventoryUpdateToApiPayload,
} from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly baseUrl = 'https://prog2005.it.scu.edu.au/ArtGalley';
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http.get<InventoryApiItem[]>(`${this.baseUrl}`).pipe(map((items) => items.map(mapApiItemToInventoryItem)));
  }

  getByName(name: string): Observable<InventoryItem> {
    return this.http.get<InventoryApiItem>(`${this.baseUrl}/${encodeURIComponent(name)}`).pipe(map(mapApiItemToInventoryItem));
  }

  create(item: InventoryCreatePayload): Observable<InventoryItem> {
    const payload: InventoryApiPayload = mapInventoryCreateToApiPayload(item);
    console.log('POST payload =>', payload);
    return this.http
      .post<InventoryApiItem>(`${this.baseUrl}`, payload, { headers: this.jsonHeaders })
      .pipe(
        tap((response) => console.log('POST response =>', response)),
        map(mapApiItemToInventoryItem),
      );
  }

  update(name: string, item: InventoryUpdatePayload): Observable<InventoryItem> {
    const payload: InventoryApiPayload = mapInventoryUpdateToApiPayload(item);
    console.log('PUT payload =>', payload);
    return this.http
      .put<InventoryApiItem>(`${this.baseUrl}/${encodeURIComponent(name)}`, payload, { headers: this.jsonHeaders })
      .pipe(
        tap((response) => console.log('PUT response =>', response)),
        map(mapApiItemToInventoryItem),
      );
  }

  delete(name: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${encodeURIComponent(name)}`);
  }
}
