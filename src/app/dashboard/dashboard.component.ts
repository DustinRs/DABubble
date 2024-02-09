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
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateChannelComponent } from '../create-channel/create-channel.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  userInfo: any;
  googleAcc = false;
  toggle = false;

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

  channels:any;

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
    console.log(this.channels);
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
}
