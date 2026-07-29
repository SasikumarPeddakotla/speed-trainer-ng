import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeakAreasComponent } from './weak-areas.component';

describe('WeakAreasComponent', () => {
  let component: WeakAreasComponent;
  let fixture: ComponentFixture<WeakAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeakAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeakAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
