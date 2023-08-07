import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Organisation2Component } from './organisation2.component';

describe('Organisation2Component', () => {
  let component: Organisation2Component;
  let fixture: ComponentFixture<Organisation2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Organisation2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Organisation2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
