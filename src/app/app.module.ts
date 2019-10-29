import { AppRoutes } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
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
import { D3Service, D3_DIRECTIVES } from './d3';
import { SHARED_VISUALS } from './shared';
import { GraphComponent } from './graph/graph.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ChatPageComponent,
    RegisterPageComponent,
    ChatUserComponent,
    ChatRoomComponent,
    ChatContainerComponent,
    ...SHARED_VISUALS,
    ...D3_DIRECTIVES,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [UrlPath , D3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
