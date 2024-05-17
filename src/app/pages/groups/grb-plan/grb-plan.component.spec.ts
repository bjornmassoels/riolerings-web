import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrbPlanComponent } from './grb-plan.component';

describe('GrbPlanComponent', () => {
  let component: GrbPlanComponent;
  let fixture: ComponentFixture<GrbPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrbPlanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GrbPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
