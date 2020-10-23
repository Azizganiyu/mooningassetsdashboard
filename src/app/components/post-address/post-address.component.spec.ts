import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAddressComponent } from './post-address.component';

describe('PostAddressComponent', () => {
  let component: PostAddressComponent;
  let fixture: ComponentFixture<PostAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
