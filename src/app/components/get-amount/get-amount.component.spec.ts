import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAmountComponent } from './get-amount.component';

describe('GetAmountComponent', () => {
  let component: GetAmountComponent;
  let fixture: ComponentFixture<GetAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
