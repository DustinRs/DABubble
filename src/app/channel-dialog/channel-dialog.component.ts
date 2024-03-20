import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-channel-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './channel-dialog.component.html',
  styleUrl: './channel-dialog.component.scss',
})
export class ChannelDialogComponent {
  friends = new FormControl('');
  friendsList: any;
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  channelId: any;
  peoples: any;
  people: any;
  peoples2: any;
  peoples3: any;
  commonNames: Set<string> = new Set();

  constructor(
    public dialogRef: MatDialogRef<ChannelDialogComponent>,
    private route: Router
  ) {
    const aCollection = collection(this.firestore, 'Friends');
    this.items$ = collectionData(aCollection);
  }

  async ngOnInit() {
    this.getChannel();
    this.getFriends();
    console.log('leude on init', this.peoples2);
  }

  async getChannel() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Channels'));
    let channels = querySnapshot.docs.map((doc) => doc.data());
    let channelsFiltered = channels.filter(
      (item) => item['id'] === this.channelId
    );
    this.peoples = channelsFiltered['0']['people'];
  }

  async getFriends() {
    const querySnapshot = await getDocs(collection(this.firestore, 'Friends'));
    let friends = querySnapshot.docs.map((doc) => doc.data());
    this.friendsList = friends['0']['friends'];
    
    const namesFriendList = this.friendsList.map(
      (friend: { Name: any }) => friend.Name
    );
    const namesPeoples2 = this.peoples2.map(
      (person: { Name: any }) => person.Name
    );

    namesFriendList.forEach((name: string) => {
      if (namesPeoples2.includes(name)) {
        this.commonNames.add(name);
        
      }
    });
    this.friendsList = this.friendsList.filter(
      (friend: { Name: string }) => !this.commonNames.has(friend.Name)
    );
  }
  
  async addPeople() {
    this.peoples2 = this.peoples2.slice(1);
    for (let i = 0; i < this.peoples2.length; i++) {
      const element = this.peoples2[i];
      
      this.peoples3.push(element)
    }
    console.log('leude nach add', this.peoples3);
    const editedChannel = doc(
      collection(this.firestore, 'Channels'),
      'C' + this.channelId 
    );
    await setDoc(editedChannel, {
      people: this.peoples3,
    }, { merge: true });
    this.dialogRef.close();
    this.route
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.route.navigate([`/dashboard/channel/${this.channelId}`]);
      });
  }
  close() {
    this.dialogRef.close();
  }
}
