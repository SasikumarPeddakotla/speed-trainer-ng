import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberSystemReferenceComponent } from './notes-reference.component';

describe('NumberSystemReferenceComponent', () => {
  let component: NumberSystemReferenceComponent;
  let fixture: ComponentFixture<NumberSystemReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberSystemReferenceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberSystemReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
