import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CervejaDetalhe } from './cerveja-detalhe';

describe('CervejaDetalhe', () => {
  let component: CervejaDetalhe;
  let fixture: ComponentFixture<CervejaDetalhe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CervejaDetalhe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CervejaDetalhe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
