import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Group } from 'models/groups';
import { ApiService } from 'services/api.service';
import {NbAuthService} from "@nebular/auth";

@Component({
  selector: 'archive-popup',
  templateUrl: './archive-popup.component.html',
  styleUrls: ['./archive-popup.component.scss'],
})
export class ArchivePopupComponent implements OnInit {
  group: Group;
  isArchiving: boolean;

  constructor(
    private matDialog: MatDialog,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isArchiving = false;
  }

  async archiveGroup() {
    this.group.archived = true;
    this.group._id = this.group.id
    this.group.user_id = this.apiService.userId;
    this.group.users = null;
    this.isArchiving = true;
    this.apiService.archiveGroup(this.group, true).subscribe(x => {
      this.toastrService.success('Het project is gearchiveerd', 'Succes!');
      this.router.navigate(['/pages/groups']);
      this.matDialog.closeAll();
    });
  }

  cancelArchive() {
    if(!this.isArchiving){
      this.matDialog.closeAll();
    }
  }
}
