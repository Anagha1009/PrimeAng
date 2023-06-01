import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErList2Component } from './er-list2.component';

describe('ErList2Component', () => {
  let component: ErList2Component;
  let fixture: ComponentFixture<ErList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErList2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
