import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnoozedComponent } from './snoozed.component';

describe('SnoozedComponent', () => {
  let component: SnoozedComponent;
  let fixture: ComponentFixture<SnoozedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnoozedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SnoozedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
