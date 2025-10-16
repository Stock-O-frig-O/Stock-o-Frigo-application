import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddButtonComponent } from './add-button.component';

describe('AddButtonComponent', () => {
  let component: AddButtonComponent;
  let fixture: ComponentFixture<AddButtonComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddButtonComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event type void', () => {
    const button = nativeElement.querySelector('button');

    spyOn(component.addButtonClick, 'emit');

    button?.click();
    fixture.detectChanges();

    expect(component.addButtonClick.emit).toHaveBeenCalled();
  });
});
