import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  selector: 'app-send-email',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss',
})
export class SendEmailComponent {
  input = false;
  emailFormControl: FormControl;
  mailAdress!: string;

  constructor(private router: Router, private http: HttpClient) {
    this.emailFormControl = new FormControl('', [
      Validators.required,
      this.validateMail(),
    ]);
  }

  sendEmail(email: string): void {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('message', 'Hallo, hier der Link zum zurücksetzen des Passwortes. LG!');

    this.http.post<any>('https://formspree.io/f/xleqjpgz', formData)
      .subscribe(
        response => {
          let overlay = document.getElementById('overlay');
    overlay?.classList.add('right');
    setTimeout(() => {
      this.router.navigateByUrl('reset-pw');
    }, 3000);
        },
        error => {
          alert(error);
          
        }
      );
  

    
  }

  enableButton() {
    if (this.emailFormControl.valid) {
      return false;
    }
    return true;
  }

  back() {
    this.router.navigateByUrl('login');
  }

  validateMail(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }
}
