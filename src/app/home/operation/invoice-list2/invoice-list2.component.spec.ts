import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceList2Component } from './invoice-list2.component';

describe('InvoiceList2Component', () => {
  let component: InvoiceList2Component;
  let fixture: ComponentFixture<InvoiceList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceList2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
