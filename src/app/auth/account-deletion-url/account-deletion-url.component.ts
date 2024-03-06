import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-deletion-url',
  templateUrl: './account-deletion-url.component.html',
  styleUrls: ['./account-deletion-url.component.scss']
})
export class AccountDeletionUrlComponent implements OnInit {
  userId: string = '';
  confirmation: string = '';

  constructor(private apiService: ApiService, private toast: NbToastrService,
              private router: Router) {
  }
  ngOnInit() {
  }

  submitDeletionRequest() {
    if (this.isFormValid()) {
      console.log('Verwijderingsverzoek ingediend voor:', this.userId);
      // Implementeer logica om het verwijderingsverzoek te verwerken
      this.apiService.sendAccountDeletionRequest(this.userId).subscribe(x => {
        this.toast.success('Uw account verwijdering met zijn data is aangevraagd en zal worden verwijderd');
        this.router.navigate(['auth/login']);
      })
      }
  }

  isFormValid() {
    return this.userId.length > 0 && this.confirmation === 'VERWIJDEREN';
  }
}
