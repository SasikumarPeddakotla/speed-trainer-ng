import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionReferenceComponent } from './conversion-reference.component';

describe('ConversionReferenceComponent', () => {
  let component: ConversionReferenceComponent;
  let fixture: ComponentFixture<ConversionReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversionReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
