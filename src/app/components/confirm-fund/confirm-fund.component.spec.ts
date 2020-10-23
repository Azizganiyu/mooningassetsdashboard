import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFundComponent } from './confirm-fund.component';

describe('ConfirmFundComponent', () => {
  let component: ConfirmFundComponent;
  let fixture: ComponentFixture<ConfirmFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
