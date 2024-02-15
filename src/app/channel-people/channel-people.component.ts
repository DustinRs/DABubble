import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChannelDialogComponent } from '../channel-dialog/channel-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-channel-people',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './channel-people.component.html',
  styleUrl: './channel-people.component.scss',
})
export class ChannelPeopleComponent {
  peoples: any;
  channelId: any;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ChannelDialogComponent>
  ) {}

  openAddUser() {
    const dialog = this.dialog.open(ChannelDialogComponent);
    dialog.componentInstance.channelId = this.channelId;
    dialog.componentInstance.peoples2 = this.peoples;
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
