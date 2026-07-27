import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesReferenceComponent } from './tables-reference.component';

describe('TablesReferenceComponent', () => {
  let component: TablesReferenceComponent;
  let fixture: ComponentFixture<TablesReferenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesReferenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablesReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
