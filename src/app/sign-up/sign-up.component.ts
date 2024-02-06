import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection, collectionData, getDocs } from '@angular/fire/firestore';
import { FormControl, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '../../models/user.class';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  hide = true;
  inputName = false;
  inputMail = false;
  inputPw = false;
  inputCheck = false;
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  user = new User();
  birthDate!: Date;
  string!: string;
  nameFormControl: FormControl;
  emailFormControl: FormControl;
  passwordFormControl: FormControl;

  constructor(private router: Router) {
    const aCollection = collection(this.firestore, 'RegisteredUsers');
    this.items$ = collectionData(aCollection);
    this.passwordFormControl = new FormControl('', [
      Validators.required,
      this.validatePassword(),
    ]);
    this.nameFormControl = new FormControl('', [
      Validators.required,
      this.validateName()
    ]);
    this.emailFormControl = new FormControl('', [
      Validators.required,
      this.validateMail(),
    ]);
  }
  
  async saveUser() {
    this.user.id = Date.now().toString();
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let users = querySnapshot.docs.map((doc) => doc.data());
    let existingUser = users.find((user) => user['email'] === this.user.email);
    if (existingUser) {
      alert("Die E-Mail existiert bereits!");
    } else {
      await setDoc(
        doc(this.firestore, 'RegisteredUsers', this.user.id),
        this.user.asJSON()
      );
      this.router.navigateByUrl('pickAvatar');
    }
  }

  back() {
    this.router.navigateByUrl('login');
  }

  enableButton() {
    if (
      this.nameFormControl.valid &&
      this.emailFormControl.valid &&
      this.passwordFormControl.valid &&
      this.inputCheck
    ) {
      return false;
    }
    return true;
  }


  validatePassword(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{4,}$/;
      const valid = passwordRegex.test(control.value);
      return valid ? null : { invalidPassword: true };
    };
  }
  validateName(): ValidatorFn {
    return (control: FormControl | any): { [key: string]: any } | null => {
      const nameRegex = /^[a-zA-Z]+\s[a-zA-Z]+$/;
      const valid = nameRegex.test(control.value);
      return valid ? null : { invalidName: true };
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
