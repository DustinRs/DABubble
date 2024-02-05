import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PickAvatarComponent } from './pick-avatar/pick-avatar.component';

export const routes: Routes = [{path: '', redirectTo: 'login', pathMatch: 'full'},
{path: 'login', component: LoginComponent},
{path: 'signUp', component: SignUpComponent},
{path: 'pickAvatar', component: PickAvatarComponent},
{path: '', component: LayoutComponent, children: [
    {path: 'dashboard', component: DashboardComponent},
]},
];
