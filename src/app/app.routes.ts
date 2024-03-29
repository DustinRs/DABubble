import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PickAvatarComponent } from './pick-avatar/pick-avatar.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChannelComponent } from './channel/channel.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { PrivacyComponent } from './privacy/privacy.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'send-email', component: SendEmailComponent },
  { path: 'reset-pw', component: ResetPasswordComponent },
  { path: 'pickAvatar', component: PickAvatarComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'privacy', component: PrivacyComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
          { path: 'channel/:id', component: ChannelComponent },
          { path: 'chat/:id', component: ChatroomComponent },
        ],
      },
    ],
  },
];
