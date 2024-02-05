import { Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection, collectionData, getDocs } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { User } from '../../models/user.class';

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

  constructor(private router: Router) {
    const aCollection = collection(this.firestore, 'RegisteredUsers');
    this.items$ = collectionData(aCollection);
  }
  async saveUser() {
    this.user.id = Date.now().toString();
    await setDoc(
      doc(this.firestore, 'RegisteredUsers', this.user.id),
      this.user.asJSON()
    );
    console.log(this.user);
    this.router.navigateByUrl('pickAvatar');
  }
  back() {
    this.router.navigateByUrl('login');
  }
  enableButton() {
    if (this.inputName && this.inputMail && this.inputPw && this.inputCheck) {
      return false;
    }
    return true;
  }
}
