import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.scss',
})
export class ChannelInfoComponent {
  firestore: Firestore = inject(Firestore);
  items$: Observable<any[]>;
  channelId: any;
  channelDescription: any;
  channelName: any;
  userInfo:any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChannelInfoComponent>
  ) {
    const aCollection = collection(this.firestore, 'Channels');
    this.items$ = collectionData(aCollection);
  }

  close() {
    this.dialogRef.close();
  }
  async closeAndSave() {
    const editedChannel = doc(
      collection(this.firestore, 'Channels'),
      'C' + this.channelId
    );
    await updateDoc(editedChannel, {
      name: this.channelName,
      description: this.channelDescription,
    });

    this.dialogRef.close();
    this.route.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.route.navigate([`/dashboard`]);
    });
    setTimeout(() => {
     this.route
      .navigateByUrl('/dashboard', { skipLocationChange: true })
      .then(() => {
        this.route.navigate([`/dashboard/channel/${this.channelId}`]);
      }); 
    }, 100);

    
  }
}
