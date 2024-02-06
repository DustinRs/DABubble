declare let google: any;
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  userInfo: any;
  googleAcc = false;

  constructor(private router: Router) {
    this.userInfo = JSON.parse(sessionStorage['loggedInUser']);
    if (this.userInfo[0] == undefined) {
      this.googleAcc = true;
      this.userInfo = this.userInfo;
    } else {
      this.userInfo = this.userInfo[0];
    }
    console.log(this.userInfo);
  }

  logout() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('');
  }
}
