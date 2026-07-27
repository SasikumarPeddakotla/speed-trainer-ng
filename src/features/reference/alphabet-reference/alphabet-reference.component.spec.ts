import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphabetReferenceComponent } from './alphabet-reference.component';

describe('AlphabetReferenceComponent', () => {
  let component: AlphabetReferenceComponent;
  let fixture: ComponentFixture<AlphabetReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphabetReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphabetReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
