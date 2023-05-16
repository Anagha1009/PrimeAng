import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmExchangeRatesComponent } from './pm-exchange-rates.component';

describe('PmExchangeRatesComponent', () => {
  let component: PmExchangeRatesComponent;
  let fixture: ComponentFixture<PmExchangeRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmExchangeRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmExchangeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
