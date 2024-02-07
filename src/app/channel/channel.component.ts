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

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
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
  loaded= false;

  constructor(private route: ActivatedRoute) {
    const aCollection = collection(this.firestore, 'Channels');
    this.items$ = collectionData(aCollection);
    
  }

  async ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      this.channelId = paramMap.get('id');
      this.getMessages();
      this.loaded= true;
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
    this.timestamps = channelsFiltered[0]['timestamps']
    
  }

  async sendMessage() {
    let timestamp = Date.now();
    let input:any = document.getElementById('channelInput');
    this.messages.push(input.value);
    this.timestamps.push(timestamp);
    console.log(this.timestamps);
    const editedChannel = doc(collection(this.firestore, 'Channels'), 'C'+this.channelId);
    await updateDoc(editedChannel, {
      messages: this.messages,
      timestamps: this.timestamps,
    });
    input.value = '';
  }

  addUser() {

  }

  openThread() {
    
  }
}
