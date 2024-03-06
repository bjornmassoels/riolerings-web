import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewDeleteDialogComponent } from './project-view-delete-dialog.component';

describe('ProjectViewDeleteDialogComponent', () => {
  let component: ProjectViewDeleteDialogComponent;
  let fixture: ComponentFixture<ProjectViewDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectViewDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectViewDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
