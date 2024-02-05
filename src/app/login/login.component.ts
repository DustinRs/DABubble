import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection, collectionData, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = true;
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  allUsers: any[] = [];
  userLogin: Login;

  constructor(private router: Router) {
    const aCollection = collection(this.firestore, 'RegisteredUsers');
    this.items$ = collectionData(aCollection);
    this.userLogin = new Login();
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
    let password: any = passwordFilterd[0];
    let mail: any = mailFiltered[0];
    console.log(this.userLogin);
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
        console.log('ja');
        this.router.navigateByUrl('/dashboard');
      } else {
        console.log('nein');
      }
    }
  }

  loginGuest() {
    this.router.navigateByUrl('dashboard');
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
