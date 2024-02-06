declare let google:any;
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection, collectionData, getDocs } from '@angular/fire/firestore';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  hide = true;
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  allUsers: any[] = [];
  userLogin: Login;
  emailValid = false;
  emailFormControl: FormControl;
  passwordFormControl: FormControl;

  constructor(private router: Router) {
    const aCollection = collection(this.firestore, 'RegisteredUsers');
    this.items$ = collectionData(aCollection);
    this.userLogin = new Login();
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      this.validatePassword(),
    ]);
    this.emailFormControl = new FormControl('', [
      Validators.required,
      this.validateMail(),
    ]);
  }
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '79801300719-aop00ktvec4ap6cf4r4p15khg5ucmb4g.apps.googleusercontent.com',
      callback: (resp:any) => this.handleLogin(resp)
    });
    google.accounts.id.renderButton(document.getElementById('googleLink'), {})
  }

  async login() {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let user = querySnapshot.docs.map((doc) => doc.data());
    let mailFiltered = user.filter((u) => u['email'] === this.userLogin.email);
    let passwordFilterd = user.filter(
      (u) => u['password'] === this.userLogin.password
    );
    let arrayFiltered = user.filter(
      item => item['email'] === this.userLogin.email
      );
      
    let password: any = passwordFilterd[0];
    let mail: any = mailFiltered[0];
    
    if (
      mail == undefined ||
      password == undefined ||
      mail == '' ||
      password == ''
    ) {
      alert('doesnt match');
    } else {
      if (
        mail['email'].toString() === this.userLogin.email &&
        password['password'].toString() === this.userLogin.password
      ) {
        alert('login erfolgreich');
        sessionStorage.setItem('loggedInUser', JSON.stringify(arrayFiltered));
        this.router.navigateByUrl('/dashboard');
      } else {
        alert('login nicht erfolgreich');
      }
    }
  }

  handleLogin(response:any) {
    if (response) {
      const payload = this.decodeToken(response.credential);
      sessionStorage.setItem('loggedInUser', JSON.stringify(payload));
      this.router.navigateByUrl('/dashboard');
    }
  }

  decodeToken(token: string) {
return JSON.parse(atob(token.split('.')[1]))
  }

  loginGuest() {
    this.router.navigateByUrl('dashboard');
  }

  validatePassword(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{4,}$/;
      const valid = passwordRegex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }
  validateMail(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const valid = emailRegex.test(control.value);
      return valid ? null : { invalidEmail: true };
    };
  }
}

export class Login {
  email: string;
  password: string;

  constructor() {
    this.password = '';
    this.email = '';
  }
}
