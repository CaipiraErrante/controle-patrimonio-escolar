import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export type AssetKind = 'moveis' | 'imoveis' | 'semoventes' | 'imateriais';

export interface InventoryItem {
  id: number;
  numeroPatrimonio: string;
  descricao: string;
  responsavel: string;
  localizacao?: string;
  estado?: string;
  dataNascimento?: string;
  dataOrigem?: string;
  autor?: string;
}

export interface InventoryPayload {
  numeroPatrimonio: string;
  descricao: string;
  responsavel: string;
  localizacao?: string;
  estado?: string;
  dataNascimento?: string;
  dataOrigem?: string;
  autor?: string;
}

const ENDPOINTS: Record<AssetKind, string> = {
  moveis: '/bens_moveis/',
  imoveis: '/bens_imoveis/',
  semoventes: '/bens_semoventes/',
  imateriais: '/bens_imateriais/',
};

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);

  async list(kind: AssetKind): Promise<InventoryItem[]> {
    const response = await firstValueFrom(
      this.http.get<InventoryItem[] | { results: InventoryItem[] }>(ENDPOINTS[kind]),
    );
    return Array.isArray(response) ? response : response.results;
  }

  async create(kind: AssetKind, payload: InventoryPayload): Promise<InventoryItem> {
    return firstValueFrom(
      this.http.post<InventoryItem>(ENDPOINTS[kind], payload),
    );
  }

  async update(
    kind: AssetKind,
    id: number,
    payload: InventoryPayload,
  ): Promise<InventoryItem> {
    return firstValueFrom(
      this.http.put<InventoryItem>(`${ENDPOINTS[kind]}${id}/`, payload),
    );
  }

  async delete(kind: AssetKind, id: number): Promise<void> {
    await firstValueFrom(
      this.http.delete<void>(`${ENDPOINTS[kind]}${id}/`),
    );
  }
}