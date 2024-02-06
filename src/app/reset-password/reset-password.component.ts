import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  hide = true;
  input = false;
  input2 = false;
  samePw = false;
  inputValue: any;
  inputValue2: any;
  passwordFormControl: FormControl;

  constructor(private router: Router) {
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      this.validatePassword(),
    ]);
  }

  resetPw() {
    let overlay = document.getElementById('overlay');
    overlay?.classList.add('right');
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3000);
  }

  enableButton() {
    if (this.passwordFormControl.valid && this.samePw) {
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

  validatePassword(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{4,}$/;
      const valid = passwordRegex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }
}
