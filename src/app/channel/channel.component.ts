import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';


@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule, DashboardComponent],

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
  users: any;
  avatars: any;
  userInfo: any;
  peoples: any[] = [];
  googleAcc = false;
  loaded = false;

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
    this.peoples.unshift(this.userInfo)
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

  openThread(id: any) {}
}
