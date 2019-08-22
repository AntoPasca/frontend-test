import { RegisterPageComponent } from './register-page/register-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppGuard } from './guard/app.guard';
import { ChatUserComponent } from './chat-user/chat-user.component';


export const AppRoutes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'chat', component: ChatPageComponent, canActivate: [AppGuard] },
  { path: 'signup', component: RegisterPageComponent }
];