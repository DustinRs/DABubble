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

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardComponent,
    MatSidenavModule,
    PickerComponent,
  ],

  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  channelId: any;
  messages: any;
  timestamps: any;
  channelName: any;
  channelDescription: any;
  users: any;
  avatars: any;
  userInfo: any;
  peoples: any[] = [];
  threadArray: any;
  googleAcc = false;
  loaded = false;
  widthSet = true;
  clickedAnswer = false;
  threadChat = ['1', '2', '3'];
  lastAnswer: any;
  emoji = false;
  emojiThread = false;
  reactions = false;
  reactionsThread = false;
  icons:any[] = [];
  iconsThread:any[] = [];

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'Channels');
    this.items$ = collectionData(aCollection);
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
      this.channelId = paramMap.get('id');
      this.getMessages();

      this.loaded = true;
    });
  }

  async getMessages() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Channels'));
    let channels = querySnapshot.docs.map((doc) => doc.data());
    let channelsFiltered = channels.filter(
      (item) => item['id'] === this.channelId
    );
    this.messages = channelsFiltered[0]['messages'];
    this.channelName = channelsFiltered[0]['name'];
    this.timestamps = channelsFiltered[0]['timestamps'];
    this.users = channelsFiltered[0]['users'];
    this.avatars = channelsFiltered[0]['avatars'];
    this.peoples = channelsFiltered[0]['people'];
    this.channelDescription = channelsFiltered[0]['description'];
    this.peoples.unshift(this.userInfo);
  }

  async sendMessage() {
    let timestamp = Date.now();
    let input: any = document.getElementById('channelInput');
    this.messages.push(input.value);
    this.timestamps.push(timestamp);
    this.users.push(this.userInfo.Name);
    this.avatars.push(this.userInfo.avatar);
    console.log(this.avatars);
    const editedChannel = doc(
      collection(this.firestore, 'Channels'),
      'C' + this.channelId
    );
    await updateDoc(editedChannel, {
      messages: this.messages,
      timestamps: this.timestamps,
      users: this.users,
      avatars: this.avatars,
    });

    input.value = '';
  }

  openAddUser() {
    const dialog = this.dialog.open(ChannelDialogComponent);
    dialog.componentInstance.channelId = this.channelId;
    dialog.componentInstance.peoples2 = this.peoples;
  }

  showPeople() {
    const dialog = this.dialog.open(ChannelPeopleComponent);
    dialog.componentInstance.channelId = this.channelId;
    dialog.componentInstance.peoples = this.peoples;
  }

  openChannelInfo() {
    const dialog = this.dialog.open(ChannelInfoComponent);
    dialog.componentInstance.channelId = this.channelId;
    dialog.componentInstance.channelName = this.channelName;
    dialog.componentInstance.channelDescription = this.channelDescription;
    dialog.componentInstance.userInfo = this.userInfo;
  }

  setWidth() {
    let div = document.getElementById('channelRoom');
    if (!this.widthSet) {
      div?.classList.remove('width');
      this.widthSet = true;
    } else {
      div?.classList.add('width');
      this.widthSet = false;
    }
  }

  answerClicked() {
    if (this.clickedAnswer) {
      this.clickedAnswer = false;
    } else {
      this.clickedAnswer = true;
    }
  }

  async getThread() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Threads'));
    let threads = querySnapshot.docs.map((doc) => doc.data());
    this.threadArray = threads['0'][`t1707688843397`];
    
  }

  async sendMessageThread() {
    let timestamp = Date.now();
    let input: any = document.getElementById('threadInput');
    const editedChannel = doc(
      collection(this.firestore, 'Threads'),
      '1707653843397'
    );
    await setDoc(
      editedChannel,
      {
        t1707688843397: [
          {
            message: 'Welche Angular Version ist die aktuellste?',
            user: 'Sofia Müller',
            avatar: 'assets/imgs/00c.Charaters (2).png',
            timestamp: '1707804900067',
          },
          {
            message:
              'Ich glaube Version 17, aber vll weiß es ja noch jemand anderes sicher.',
            user: 'Noah Braun',
            avatar: 'assets/imgs/00c.Charaters (3).png',
            timestamp: '1707804900067',
          },
          {
            message:
              'Ja das stimmt. Ich habe gegoogelt und Angular17 ist die aktuellste Version!',
            user: this.userInfo.Name,
            avatar: this.userInfo.avatar,
            timestamp: '1707807809308',
          },
          {
            message: input.value,
            user: this.userInfo.Name,
            avatar: this.userInfo.avatar,
            timestamp: timestamp,
          },
        ],
      },
      { merge: true }
    );
    input.value = '';
    this.threadChat.push('4');
    this.getThread();
  }

  addEmoji(emojiData: any) {
    let div: any = document.getElementById('emoji');
    let input: any = document.getElementById('channelInput');
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

  addEmojiThread(emojiData: any) {
    let div: any = document.getElementById('emojiThread');
    let input: any = document.getElementById('threadInput');
    let emoji = emojiData.emoji.native;
    input.value += emoji;
    div.classList.add('d-none');
    this.emojiThread = false;
  }

  emojisThread() {
    let div: any = document.getElementById('emojiThread');
    if (!this.emojiThread) {
      div.classList.remove('d-none');
      this.emojiThread = true;
    } else {
      div.classList.add('d-none');
      this.emojiThread = false;
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

  addReactionThread(emojiData: any) {
    let div: any = document.getElementById('reactionsThread');
    let emoji = emojiData.emoji.native;
    this.iconsThread.push(emoji)
    div.classList.add('d-none');
    this.reactionsThread = false;
    console.log(emojiData.emoji)
  }

  reactionThread() {
    let div: any = document.getElementById('reactionsThread');
    if (!this.reactionsThread) {
      div.classList.remove('d-none');
      this.reactionsThread = true;
    } else {
      div.classList.add('d-none');
      this.reactionsThread = false;
    }
  }
}
