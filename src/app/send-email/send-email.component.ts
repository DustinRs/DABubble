import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
})
export class SendEmailComponent {
  input = false;

  constructor(private router: Router) {}

  sendMail() {
    let overlay = document.getElementById('overlay');
    overlay?.classList.add('right');
    setTimeout(() => {
      this.router.navigateByUrl('reset-pw');
    }, 3000);
  }

  enableButton() {
    if (this.input) {
      return false;
    }
    return true;
  }

  back() {
    this.router.navigateByUrl('login');
  }
}
