import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeletionUrlComponent } from './account-deletion-url.component';

describe('AccountDeletionUrlComponent', () => {
  let component: AccountDeletionUrlComponent;
  let fixture: ComponentFixture<AccountDeletionUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountDeletionUrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDeletionUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
