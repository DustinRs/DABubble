declare let google: any;
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  Firestore,
  collection,
  collectionData,
  getDocs,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    MatListModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class DashboardComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  userInfo: any;
  googleAcc = false;
  toggle = false;
  searchInput: any;
  friends = [
    {
      Name: 'Frederick Beck',
      Job: 'Dev-Mentor',
      avatar: 'assets/imgs/00c.Charaters (1).png',
      online: 'online',
    },
    {
      Name: 'Sofia Müller',
      Job: 'Dev-Mentor',
      avatar: 'assets/imgs/00c.Charaters (2).png',
      online: 'online',
    },
    {
      Name: 'Noha Braun',
      Job: 'Student',
      avatar: 'assets/imgs/00c.Charaters (3).png',
      online: 'online',
    },
    {
      Name: 'Elise Roth',
      Job: 'Student',
      avatar: 'assets/imgs/00c.Charaters (5).png',
      online: 'online',
    },
    {
      Name: 'Elias Neumann',
      Job: 'Student',
      avatar: 'assets/imgs/00c.Charaters (4).png',
      online: 'notonline',
    },
    {
      Name: 'Steffen Hoffmann',
      Job: 'Student',
      avatar: 'assets/imgs/00c.Charaters (6).png',
      online: 'notonline',
    },
  ];

  channels: any;
  friendsFiltered: any;
  channelsFiltered: any;
  messagesFiltered: any;
  threadsFiltered: any;
  chatrooms: any;

  constructor(private router: Router, public dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'Channels');
    this.items$ = collectionData(aCollection);
    this.userInfo = JSON.parse(sessionStorage['loggedInUser']);
    if (this.userInfo[0] == undefined) {
      this.googleAcc = true;
      this.userInfo = this.userInfo;
    } else {
      this.userInfo = this.userInfo[0];
      this.friends.unshift(this.userInfo);
    }
    console.log(this.userInfo);
  }
  async ngOnInit() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Channels'));
    let channels = querySnapshot.docs.map((doc) => doc.data());
    this.channels = channels;
    const chatroomsSnapshot = await getDocs(collection(this.firestore, 'Chatrooms'));
    let chatrooms = chatroomsSnapshot.docs.map((doc) => doc.data());
    this.chatrooms = chatrooms;
    console.log(this.chatrooms);
  }

  logout() {
    google.accounts.id.disableAutoSelect();
    sessionStorage.removeItem('loggedInUser');
    this.router.navigateByUrl('');
  }

  isActive() {}
  showList(id: string) {
    let div = document.getElementById(id);
    let button = document.getElementById(id + 'Button');
    if (this.toggle) {
      div?.classList.remove('d-none');
      button?.classList.add('turn');
      this.toggle = false;
    } else {
      div?.classList.add('d-none');
      button?.classList.remove('turn');
      this.toggle = true;
    }
  }

  openDialog() {
    this.dialog.open(CreateChannelComponent);
  }

  openProfile() {
    const dialog = this.dialog.open(ProfileComponent);
    dialog.componentInstance.userInfo = this.userInfo;
  }

  async search() {
    let div = document.getElementById('searchResultsDiv');
    let divMobile = document.getElementById('searchResultsDivMobile');
    div?.classList.remove('d-none');
    divMobile?.classList.remove('d-none');
    const friendsSnapshot = await getDocs(
      collection(this.firestore, 'Friends')
    );
    const channelsSnapshot = await getDocs(
      collection(this.firestore, 'Channels')
    );
    const threadsSnapshot = await getDocs(
      collection(this.firestore, 'Threads')
    );
    let friendData = friendsSnapshot.docs.map((doc) => doc.data());
    let channelData = channelsSnapshot.docs.map((doc) => doc.data());
    let messagesData = channelsSnapshot.docs.map((doc) => doc.data());
    let threadData = threadsSnapshot.docs.map((doc) => doc.data());

    let friendsFiltered = friendData['0']['friends'].filter(
      (u: { [x: string]: any }) =>
        u['Name'].toLowerCase().includes(this.searchInput.toLowerCase())
    );
    let channelsFiltered = channelData.filter((u: { [x: string]: any }) =>
      u['name'].toLowerCase().includes(this.searchInput.toLowerCase())
    );
    let messagesFiltered = messagesData.filter((u: any) =>
      u['messages'].includes(this.searchInput)
    );
    this.friendsFiltered = friendsFiltered;
    this.channelsFiltered = channelsFiltered;
    this.messagesFiltered = messagesFiltered;

    console.log('messages', messagesFiltered);
    // console.log('threads', threadData);
    // console.log('searchInput', this.searchInput);
  }

  clearSearch() {
    let div = document.getElementById('searchResultsDiv');
    let divMobile = document.getElementById('searchResultsDivMobile');
    div?.classList.add('d-none');
    divMobile?.classList.add('d-none');
    this.friendsFiltered = [];
    this.channelsFiltered = [];
  }

  setIndex() {
    let div = document.getElementById('matDrawer');
    div?.classList.add('z3');
  }
}
