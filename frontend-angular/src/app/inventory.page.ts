import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';
import {
  AssetKind,
  InventoryItem,
  InventoryPayload,
  InventoryService,
} from './inventory.service';

interface AssetKindOption {
  value: AssetKind;
  label: string;
}

type InventoryFilter = AssetKind | 'all';

interface InventoryRow extends InventoryItem {
  kind: AssetKind;
}

interface InventoryForm {
  numeroPatrimonio: string;
  descricao: string;
  responsavel: string;
  localizacao: string;
  estado: string;
  dataNascimento: string;
  dataOrigem: string;
  autor: string;
}

const EMPTY_FORM: InventoryForm = {
  numeroPatrimonio: '',
  descricao: '',
  responsavel: '',
  localizacao: '',
  estado: '',
  dataNascimento: '',
  dataOrigem: '',
  autor: '',
};

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './inventory.page.html',
  styleUrl: './inventory.page.css',
})
export class InventoryPage implements OnInit {
  private readonly inventoryService = inject(InventoryService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private listRequestId = 0;

  readonly kinds: AssetKindOption[] = [
    { value: 'moveis', label: 'Bens móveis' },
    { value: 'imoveis', label: 'Bens imóveis' },
    { value: 'semoventes', label: 'Bens semoventes' },
    { value: 'imateriais', label: 'Bens imateriais' },
  ];

  formKind: AssetKind = 'moveis';
  listFilter: InventoryFilter = 'all';
  form: InventoryForm = { ...EMPTY_FORM };
  items: InventoryRow[] = [];
  editingId: number | null = null;
  editingKind: AssetKind | null = null;
  isLoading = false;
  isSaving = false;
  isSigningOut = false;
  mensagem = '';
  isError = false;

  ngOnInit(): void {
    void this.loadItems();
  }

  get listTitle(): string {
    return this.listFilter === 'all'
      ? 'Todos os bens'
      : this.kindLabel(this.listFilter);
  }

  get usesLocationAndCondition(): boolean {
    return this.formKind === 'moveis' || this.formKind === 'imoveis';
  }

  get usesBirthDate(): boolean {
    return this.formKind === 'semoventes';
  }

  get usesOriginAndAuthor(): boolean {
    return this.formKind === 'imateriais';
  }

  async loadItems(): Promise<void> {
    this.mensagem = '';
    await this.refreshItems();
  }

  async changeListFilter(): Promise<void> {
    this.mensagem = '';
    await this.refreshItems();
  }

  changeFormKind(): void {
    this.cancelEdit();
  }

  private async refreshItems(): Promise<void> {
    const requestId = ++this.listRequestId;
    const filter = this.listFilter;
    this.isLoading = true;

    try {
      if (filter === 'all') {
        const groups = await Promise.all(
          this.kinds.map(async ({ value }) => ({
            kind: value,
            items: await this.inventoryService.list(value),
          })),
        );
        if (requestId === this.listRequestId) {
          this.items = groups.flatMap(({ kind, items }) =>
            items.map((item) => ({ ...item, kind })),
          );
        }
      } else {
        const items = await this.inventoryService.list(filter);
        if (requestId === this.listRequestId) {
          this.items = items.map((item) => ({ ...item, kind: filter }));
        }
      }
    } catch (error) {
      if (requestId === this.listRequestId) {
        this.showError(error, 'Não foi possível carregar os patrimônios.');
      }
    } finally {
      if (requestId === this.listRequestId) {
        this.isLoading = false;
      }
    }
  }

  async save(): Promise<void> {
    this.isSaving = true;
    this.mensagem = '';
    const payload = this.toPayload();
    try {
      if (this.editingId === null || this.editingKind === null) {
        const kind = this.formKind;
        const created = await this.inventoryService.create(kind, payload);
        this.listFilter = 'all';
        this.items = [
          ...this.items.filter(
            (item) => item.kind !== kind || item.id !== created.id,
          ),
          { ...created, kind },
        ];
        this.mensagem = 'Patrimônio cadastrado.';
      } else {
        const kind = this.editingKind;
        const id = this.editingId;
        const updated = await this.inventoryService.update(kind, id, payload);
        this.items = this.items.map((item) =>
          item.kind === kind && item.id === id ? { ...updated, kind } : item,
        );
        this.mensagem = 'Patrimônio atualizado.';
      }
      this.isError = false;
      this.cancelEdit();
      void this.refreshItems();
    } catch (error) {
      this.showError(error, 'Não foi possível salvar o patrimônio.');
    } finally {
      this.isSaving = false;
    }
  }
  edit(item: InventoryRow): void {
    this.formKind = item.kind;
    this.editingId = item.id;
    this.editingKind = item.kind;
    this.form = {
      numeroPatrimonio: item.numeroPatrimonio,
      descricao: item.descricao,
      responsavel: item.responsavel,
      localizacao: item.localizacao ?? '',
      estado: item.estado ?? '',
      dataNascimento: item.dataNascimento ?? '',
      dataOrigem: item.dataOrigem ?? '',
      autor: item.autor ?? '',
    };
    this.mensagem = '';
  }

  async remove(item: InventoryRow): Promise<void> {
    if (!window.confirm(`Excluir o patrimônio ${item.numeroPatrimonio}?`)) {
      return;
    }

    this.mensagem = '';
    try {
      await this.inventoryService.delete(item.kind, item.id);
      this.items = this.items.filter(
        (current) => current.kind !== item.kind || current.id !== item.id,
      );
      this.mensagem = 'Patrimônio excluído.';
      this.isError = false;
    } catch (error) {
      this.showError(error, 'Não foi possível excluir o patrimônio.');
    }
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingKind = null;
    this.form = { ...EMPTY_FORM };
  }

  async signOut(): Promise<void> {
    this.isSigningOut = true;
    this.mensagem = '';
    try {
      await this.authService.logout();
      await this.router.navigateByUrl('/login');
    } catch (error) {
      this.showError(error, 'Não foi possível encerrar a sessão.');
    } finally {
      this.isSigningOut = false;
    }
  }

  kindLabel(kind: AssetKind): string {
    return this.kinds.find((option) => option.value === kind)?.label ?? '';
  }

  itemDetail(item: InventoryRow): string {
    if (item.kind === 'semoventes') {
      return item.dataNascimento ?? '';
    }
    if (item.kind === 'imateriais') {
      return item.dataOrigem ?? '';
    }
    return item.localizacao ?? '';
  }

  itemDetailLabel(item: InventoryRow): string {
    if (item.kind === 'semoventes' || item.kind === 'imateriais') {
      return 'Data';
    }
    return 'Localização';
  }

  itemStatus(item: InventoryRow): string {
    return item.kind === 'imateriais' ? item.autor ?? '' : item.estado ?? '';
  }

  itemStatusLabel(item: InventoryRow): string {
    return item.kind === 'imateriais' ? 'Autor' : 'Estado';
  }

  private toPayload(): InventoryPayload {
    const payload: InventoryPayload = {
      numeroPatrimonio: this.form.numeroPatrimonio.trim(),
      descricao: this.form.descricao.trim(),
      responsavel: this.form.responsavel.trim(),
    };
    if (this.usesLocationAndCondition) {
      payload.localizacao = this.form.localizacao.trim();
      payload.estado = this.form.estado.trim();
    } else if (this.usesBirthDate) {
      payload.dataNascimento = this.form.dataNascimento;
      payload.estado = this.form.estado.trim();
    } else {
      payload.dataOrigem = this.form.dataOrigem;
      payload.autor = this.form.autor.trim();
    }
    return payload;
  }

  private showError(error: unknown, fallback: string): void {
    this.isError = true;
    if (error instanceof HttpErrorResponse && error.status === 401) {
      this.mensagem = 'Sua sessão expirou. Entre novamente.';
      void this.router.navigateByUrl('/login');
    } else if (error instanceof HttpErrorResponse && error.status === 403) {
      this.mensagem =
        'Sua conta não tem permissão para esta ação. Peça acesso a um administrador.';
    } else if (error instanceof HttpErrorResponse && error.status === 400) {
      this.mensagem = 'Confira os campos informados e tente novamente.';
    } else if (error instanceof HttpErrorResponse && error.status === 0) {
      this.mensagem = 'Não foi possível conectar ao servidor.';
    } else {
      this.mensagem = fallback;
    }
  }
}