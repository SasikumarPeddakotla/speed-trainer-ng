import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionTypeSettingComponent } from './session-type-setting.component';

describe('SessionTypeSettingComponent', () => {
  let component: SessionTypeSettingComponent;
  let fixture: ComponentFixture<SessionTypeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTypeSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionTypeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
