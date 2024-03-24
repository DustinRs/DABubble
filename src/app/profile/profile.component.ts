import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  userInfo: any;
  name: any;
  email: any;
  avatar: any;
  online: any;

  constructor(public dialogRef: MatDialogRef<ProfileComponent>) {}

  ngOnInit() {
    this.name = this.userInfo.Name || this.userInfo.name;
    this.email = this.userInfo.email;
    this.avatar = this.userInfo.avatar || this.userInfo.picture;
    this.online = this.userInfo.online || 'online';
  }

  close() {
    this.dialogRef.close();
  }
}
