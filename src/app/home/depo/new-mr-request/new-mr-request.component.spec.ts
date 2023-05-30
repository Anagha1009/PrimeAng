import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMrRequestComponent } from './new-mr-request.component';

describe('NewMrRequestComponent', () => {
  let component: NewMrRequestComponent;
  let fixture: ComponentFixture<NewMrRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMrRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMrRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
