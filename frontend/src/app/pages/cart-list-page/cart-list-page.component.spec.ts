import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartListPageComponent } from './cart-list-page.component';

describe('CartListPageComponent', () => {
  let component: CartListPageComponent;
  let fixture: ComponentFixture<CartListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartListPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
