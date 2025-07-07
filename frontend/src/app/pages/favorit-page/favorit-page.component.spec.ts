import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritPageComponent } from './favorit-page.component';

describe('FavoritPageComponent', () => {
  let component: FavoritPageComponent;
  let fixture: ComponentFixture<FavoritPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
