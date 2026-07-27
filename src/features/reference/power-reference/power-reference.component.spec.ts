import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerReferenceComponent } from './power-reference.component';

describe('PowerReferenceComponent', () => {
  let component: PowerReferenceComponent;
  let fixture: ComponentFixture<PowerReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowerReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
