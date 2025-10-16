import { TestBed } from '@angular/core/testing';

import { FavoritService } from './favorit.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('FavoritService', () => {
  let service: FavoritService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritService],
    });
    service = TestBed.inject(FavoritService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch data from API', () => {
    service.getAllFavorite().subscribe((data) => {
      expect(data).toEqual([
        {
          id: 1,
          name: 'Test',
          productId: 1,
          brand: 'toto',
          unit: 'string',
          category: 'string',
          limit: 1,
          isCheck: true,
          favorite: true,
        },
      ]);
    });

    const req = httpMock.expectOne('https://api.example.com/data');
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 1,
      name: 'Test',
      productId: 1,
      brand: 'toto',
      unit: 'string',
      category: 'string',
      limit: 1,
      isCheck: true,
      favorite: true,
    });
  });
});
