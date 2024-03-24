import { Component, ViewChild, inject } from '@angular/core';
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
  setDoc,
} from '@angular/fire/firestore';
import { User } from '../../models/user.class';
import { doc, updateDoc } from 'firebase/firestore';
import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';

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
  file: File | undefined;
  storage: any;
  customPicture = false;
  @ViewChild('imagePreview') imagePreview: any;
  url: any;

  constructor(private router: Router) {
    const aCollection = collection(this.firestore, 'RegisteredUsers');
    this.items$ = collectionData(aCollection);
    const storage = getStorage();
    this.storage = storage;
  }

  async ngOnInit() {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let user = querySnapshot.docs.map((doc) => doc.data());
    let userFiltered = user.filter((u) => u['avatar'] === '');
    let userName = userFiltered['0']['Name'];
    this.userName = userName;
    const storageRef = ref(this.storage, userName);
    this.storage = storageRef;
  }

  async save() {
    if (this.file) {
      this.customPicture = true;
      await this.sendFile(this.storage, this.file);
      // let userName = this.userName.replace(/ /g, '%');
      await this.getImgUrl(this.storage, this.userName);
      this.saveUserCustomPicture(this.url);
    }
    if (!this.customPicture) {
      this.saveUser();
    }
  }

  async getImgUrl(storage: any, img: any) {
    await getDownloadURL(ref(storage))
      .then((url) => {
        this.url = url;
      })
  }

  async saveUserCustomPicture(picSource: any) {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let user = querySnapshot.docs.map((doc) => doc.data());
    let userFiltered = user.filter((u) => u['avatar'] === '');
    let userId = userFiltered['0']['id'];
    let userName = userFiltered['0']['Name'];
    await setDoc(doc(this.firestore, 'Chatrooms', userName), {
      avatars: [],
      messages: [],
      users: [],
      timestamps: [],
      id: userName,
      link: 'chat',
      avatar: picSource,
      online: 'online',
    });

    const editedUser = doc(
      collection(this.firestore, 'RegisteredUsers'),
      userId
    );
    await updateDoc(editedUser, {
      avatar: picSource,
    });

    this.showPopUp();
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 3000);
  }

  async saveUser() {
    const querySnapshot = await getDocs(
      collection(this.firestore, 'RegisteredUsers')
    );
    let user = querySnapshot.docs.map((doc) => doc.data());
    let userFiltered = user.filter((u) => u['avatar'] === '');
    let userId = userFiltered['0']['id'];
    let userName = userFiltered['0']['Name'];
    await setDoc(doc(this.firestore, 'Chatrooms', userName), {
      avatars: [],
      messages: [],
      users: [],
      timestamps: [],
      id: userName,
      link: 'chat',
      avatar: this.imgPath,
      online: 'online',
    });

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
    if (this.customPicture) {
      this.imagePreview.nativeElement.value = null;
      this.customPicture = false;
    }
    this.avatarPicked = true;
    this.imgPath = `assets/imgs/00c.Charaters (${id}).png`;
  }

  enableButton() {
    if (this.avatarPicked || this.customPicture) {
      return false;
    }
    return true;
  }

  showPopUp() {
    let overlay = document.getElementById('overlay');
    overlay?.classList.add('right');
  }

  getFile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreview = document.getElementById(
          'imagePreview'
        ) as HTMLImageElement;
        if (imagePreview) {
          imagePreview.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
    this.file = file;
    this.customPicture = true;
  }
  async sendFile(storageRef: any, file: any) {
    await uploadBytes(storageRef, file).then((snapshot) => {
    });
  }
}
