import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(InventoryService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the backend endpoints for list, create, update and delete', async () => {
    const item = {
      id: 10,
      numeroPatrimonio: 'PAT-10',
      descricao: 'Notebook',
      responsavel: 'Coordenação',
      localizacao: 'Sala 1',
      estado: 'bom',
    };

    const listRequest = service.list('moveis');
    http.expectOne('/bens_moveis/').flush([item]);
    await expect(listRequest).resolves.toEqual([item]);

    const payload = {
      numeroPatrimonio: item.numeroPatrimonio,
      descricao: item.descricao,
      responsavel: item.responsavel,
      localizacao: item.localizacao,
      estado: item.estado,
    };
    const createRequest = service.create('moveis', payload);
    const createHttp = http.expectOne('/bens_moveis/');
    expect(createHttp.request.method).toBe('POST');
    createHttp.flush(item);
    await expect(createRequest).resolves.toEqual(item);

    const updateRequest = service.update('moveis', item.id, payload);
    const updateHttp = http.expectOne('/bens_moveis/10/');
    expect(updateHttp.request.method).toBe('PUT');
    updateHttp.flush(item);
    await expect(updateRequest).resolves.toEqual(item);

    const deleteRequest = service.delete('moveis', item.id);
    const deleteHttp = http.expectOne('/bens_moveis/10/');
    expect(deleteHttp.request.method).toBe('DELETE');
    deleteHttp.flush(null);
    await expect(deleteRequest).resolves.toBeUndefined();
  });
});