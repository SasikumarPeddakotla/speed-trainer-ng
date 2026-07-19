import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTypeSelectorComponent } from './session-type-selector.component';

describe('SessionTypeSelectorComponent', () => {
  let component: SessionTypeSelectorComponent;
  let fixture: ComponentFixture<SessionTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTypeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
