import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsHomePageComponent } from './settings-home-page.component';

describe('SettingsHomePageComponent', () => {
  let component: SettingsHomePageComponent;
  let fixture: ComponentFixture<SettingsHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsHomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
