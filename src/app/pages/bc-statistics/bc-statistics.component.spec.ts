import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcStatisticsComponent } from './bc-statistics.component';

describe('BcStatisticsComponent', () => {
  let component: BcStatisticsComponent;
  let fixture: ComponentFixture<BcStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
