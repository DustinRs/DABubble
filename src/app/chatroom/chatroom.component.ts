import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { ChannelPeopleComponent } from '../channel-people/channel-people.component';
import { ChannelInfoComponent } from '../channel-info/channel-info.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { ProfileComponent } from '../profile/profile.component';
import { ProfilefriendComponent } from '../profilefriend/profilefriend.component';

@Component({
  selector: 'app-chatroom',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardComponent,
    MatSidenavModule,
    PickerComponent,
  ],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss',
})
export class ChatroomComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  chatId: any;
  messages: any;
  timestamps: any;
  chatName: any;
  chatAvatar:any;
  chatOnline:any;
  users: any;
  avatars: any;
  userInfo: any;
  googleAcc = false;
  loaded = false;
  emoji = false;
  reactions = false;
  icons:any[] = [];


  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'Chatrooms');
    this.items$ = collectionData(aCollection);
    this.messages = [];
    this.userInfo = JSON.parse(sessionStorage['loggedInUser']);
    if (this.userInfo[0] == undefined) {
      this.googleAcc = true;
      this.userInfo = this.userInfo;
      this.userInfo.avatar = this.userInfo.picture;
      this.userInfo.Name = this.userInfo.name;
    } else {
      this.userInfo = this.userInfo[0];
    }
  }

  async ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.chatId = paramMap.get('id');
      this.getMessages();

      this.loaded = true;
    });
  }

  async getMessages() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Chatrooms'));
    let chats = querySnapshot.docs.map((doc) => doc.data());
    let chatsFiltered = chats.filter(
      (item) => item['id'] === this.chatId
    );
    this.messages = chatsFiltered[0]['messages'];
    this.chatName = chatsFiltered[0]['id'];
    this.timestamps = chatsFiltered[0]['timestamps'];
    this.avatars = chatsFiltered[0]['avatars'];
    this.users = chatsFiltered[0]['users']; 
    this.chatAvatar = chatsFiltered[0]['avatar'];
    this.chatOnline = chatsFiltered[0]['online'];
    console.log('this.messages',this.messages)
  }

  async sendMessage() {
    let timestamp = Date.now();
    let input: any = document.getElementById('chatInput');
    this.messages.push(input.value);
    this.timestamps.push(timestamp);
    this.users.push(this.userInfo.Name);
    this.avatars.push(this.userInfo.avatar);
    console.log(this.avatars);
    const editedChannel = doc(
      collection(this.firestore, 'Chatrooms'),
      this.chatId
    );
    await updateDoc(editedChannel, {
      messages: this.messages,
      timestamps: this.timestamps,
      users: this.users,
      avatars: this.avatars,
    });

    input.value = '';
  }

  addEmoji(emojiData: any) {
    let div: any = document.getElementById('emoji');
    let input: any = document.getElementById('chatInput');
    let emoji = emojiData.emoji.native;
    input.value += emoji;
    div.classList.add('d-none');
    this.emoji = false;
  }

  emojis() {
    let div: any = document.getElementById('emoji');
    if (!this.emoji) {
      div.classList.remove('d-none');
      this.emoji = true;
    } else {
      div.classList.add('d-none');
      this.emoji = false;
    }
  }

  addReaction(emojiData: any) {
    let div: any = document.getElementById('reactions');
    let emoji = emojiData.emoji.native;
    this.icons.push(emoji)
    div.classList.add('d-none');
    this.reactions = false;
    console.log(emojiData.emoji)
  }

  reaction() {
    let div: any = document.getElementById('reactions');
    if (!this.reactions) {
      div.classList.remove('d-none');
      this.reactions = true;
    } else {
      div.classList.add('d-none');
      this.reactions = false;
    }
  }

  openProfile() {
    const dialog = this.dialog.open(ProfileComponent);
    dialog.componentInstance.userInfo = this.userInfo;
  }

  openProfileFriend() {
    const dialog = this.dialog.open(ProfilefriendComponent);
    dialog.componentInstance.friendId = this.chatId;
  }

  removeIndex() {
    let div = document.getElementById('matDrawer');
    div?.classList.remove('z3');
  }
}
