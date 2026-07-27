import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyReferenceComponent } from './vocabulary-reference.component';

describe('VocabularyReferenceComponent', () => {
  let component: VocabularyReferenceComponent;
  let fixture: ComponentFixture<VocabularyReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VocabularyReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
