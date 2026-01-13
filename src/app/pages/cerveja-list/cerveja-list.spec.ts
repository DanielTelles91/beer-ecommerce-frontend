import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CervejaList } from './cerveja-list';

describe('CervejaList', () => {
  let component: CervejaList;
  let fixture: ComponentFixture<CervejaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CervejaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CervejaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
