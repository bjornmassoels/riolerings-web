import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsArchiveComponent } from './groups-archive.component';

describe('GroupsArchiveComponent', () => {
  let component: GroupsArchiveComponent;
  let fixture: ComponentFixture<GroupsArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
