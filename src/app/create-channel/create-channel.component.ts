import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Channel } from '../../models/channel.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatIconModule,
  ],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  firestore: Firestore = inject(Firestore);
  channel = new Channel();
  items$: any;
  emptyArray: any[] | undefined;

  constructor(
    public dialogRef: MatDialogRef<CreateChannelComponent>,
    public dialog: MatDialog,
    private route: Router
  ) {
    const aCollection = collection(this.firestore, 'Channels');
    this.items$ = collectionData(aCollection);
  }

  async saveChannel() {
    this.channel.id = Date.now().toString();
    const querySnapshot = await getDocs(collection(this.firestore, 'Channels'));
    let channels = querySnapshot.docs.map((doc) => doc.data());
    let filteredName = channels.filter((c) => c['name'] === this.channel.name);
    console.log(filteredName);
    console.log(this.channel.name);
    
    if (filteredName === undefined || filteredName.length === 0) {
      await setDoc(
        doc(this.firestore, 'Channels', 'C' + this.channel.id),
        this.channel.asJson()
      );
      this.dialogRef.close();
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([`dashboard`]);
      });
      setTimeout(() => {
        this.route
          .navigateByUrl('/dashboard', { skipLocationChange: true })
          .then(() => {
            this.route.navigate([`/dashboard/channel/${this.channel.id}`]);
          });
      }, 500);
    } else {
      alert('Channel existiert bereits, wähle einen anderen Namen!');
    }
  }
}
