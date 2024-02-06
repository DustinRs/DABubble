import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  getDocs,
} from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { doc, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-pick-avatar',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatListModule,
    CommonModule,
  ],
  templateUrl: './pick-avatar.component.html',
  styleUrl: './pick-avatar.component.scss',
})
export class PickAvatarComponent {
  avatarPicked = false;
  imgPath: any;
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  user!: User;
  userName: any;

  constructor(private router: Router) {
    const aCollection = collection(this.firestore, 'RegisteredUsers');
    this.items$ = collectionData(aCollection);
  }

  async ngOnInit() {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let user = querySnapshot.docs.map((doc) => doc.data());
    let userFiltered = user.filter((u) => u['avatar'] === '');
    let userName = userFiltered['0']['Name'];
    this.userName = userName;
  }

  async saveUser() {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let user = querySnapshot.docs.map((doc) => doc.data());
    let userFiltered = user.filter((u) => u['avatar'] === '');
    let userId = userFiltered['0']['id'];
    const editedUser = doc(
      collection(this.firestore, 'RegisteredUsers'),
      userId
    );
    await updateDoc(editedUser, {
      avatar: this.imgPath,
    });
    this.showPopUp();
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3000);
  }

  back() {
    this.router.navigateByUrl('signUp');
  }

  setAvatar(id: string) {
    this.avatarPicked = true;
    this.imgPath = `assets/imgs/00c.Charaters (${id}).png`;
  }

  enableButton() {
    if (this.avatarPicked) {
      return false;
    }
    return true;
  }

  showPopUp() {
    let overlay = document.getElementById('overlay');
    overlay?.classList.add('right');
  }
}