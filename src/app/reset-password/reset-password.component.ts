import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  hide = true;
  input = false;
  input2 = false;
  samePw = false;
  inputValue: any;
  inputValue2: any;

  constructor(private router: Router) {}

  resetPw() {
    let overlay = document.getElementById('overlay');
    overlay?.classList.add('right');
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3000);
  }

  enableButton() {
    if (this.input && this.samePw) {
      return false;
    }
    return true;
  }

  back() {
    this.router.navigateByUrl('send-email');
  }

  checkSamePw() {
    if (this.inputValue === this.inputValue2) {
      return this.samePw = true;
    }
    return this.samePw = false;
  }
}
