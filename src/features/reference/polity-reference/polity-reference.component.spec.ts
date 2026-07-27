import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolityReferenceComponent } from './polity-reference.component';

describe('PolityReferenceComponent', () => {
  let component: PolityReferenceComponent;
  let fixture: ComponentFixture<PolityReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolityReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolityReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
