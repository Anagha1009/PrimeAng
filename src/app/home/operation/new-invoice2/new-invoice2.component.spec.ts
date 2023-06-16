import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewInvoice2Component } from './new-invoice2.component';

describe('NewInvoice2Component', () => {
  let component: NewInvoice2Component;
  let fixture: ComponentFixture<NewInvoice2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewInvoice2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewInvoice2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
