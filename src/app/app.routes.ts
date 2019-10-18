import { RegisterPageComponent } from './register-page/register-page.component';
import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppGuard } from './guard/app.guard';
import { ChatContainerComponent } from './chat-container/chat-container.component';


export const AppRoutes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'chat', component: ChatContainerComponent, canActivate: [AppGuard] },
  { path: 'signup', component: RegisterPageComponent }
];