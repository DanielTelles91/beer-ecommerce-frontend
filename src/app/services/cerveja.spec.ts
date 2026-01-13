import { TestBed } from '@angular/core/testing';

import { Cerveja } from './cerveja';

describe('Cerveja', () => {
  let service: Cerveja;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Cerveja);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
