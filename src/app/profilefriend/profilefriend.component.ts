import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profilefriend',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './profilefriend.component.html',
  styleUrl: './profilefriend.component.scss'
})
export class ProfilefriendComponent {
  firestore: Firestore = inject(Firestore);
  friendInfo: any;
  friendId: any;
  name: any;
  email: any;
  avatar: any;
  online: any;

  constructor(public dialogRef: MatDialogRef<ProfilefriendComponent>) {}

  async ngOnInit() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Friends'));
    let chats = querySnapshot.docs.map((doc) => doc.data());
    let chatsFiltered = chats[0]['friends'].filter(
      (item:any) => item['Name'] === this.friendId
    );
    this.name = chatsFiltered[0]['Name'];
    this.email = chatsFiltered[0]['email'];
    this.avatar = chatsFiltered[0]['avatar'];
    this.online = chatsFiltered[0]['online'];
    console.log('info', chatsFiltered);
    
  }

  close() {
    this.dialogRef.close();
  }
}
