import { SpinnerComponent } from './http-interceptor/spinner/spinner.component';
import { RequestHttpInterceptor } from './http-interceptor/request-http-interceptor';
import { HttpMonitor } from './http-interceptor/http-monitor';
import { AppRoutes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UrlPath } from './app.costants';
import { LoginPageComponent } from './login-page/login-page.component';
import { RouterModule } from '@angular/router';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ChatUserComponent } from './chat-user/chat-user.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { ChatContainerComponent } from './chat-container/chat-container.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ChatPageComponent,
    RegisterPageComponent,
    ChatUserComponent,
    ChatRoomComponent,
    ChatContainerComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    MaterialModule,
    MatProgressBarModule
  ],
  providers: [
    UrlPath,
    HttpMonitor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestHttpInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
