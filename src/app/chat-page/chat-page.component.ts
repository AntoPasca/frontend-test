import { MessageService } from './../service/message-service';
import { UserService } from './../service/user-service';
import { ChatMessage } from '../dto/ChatMessage';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { UrlPath } from '../app.costants';
import { User } from '../dto/User';
import { Subscription } from 'rxjs';
import { RoomService } from '../service/room-service';
import { Room } from '../dto/Room';
import { ChatMessageType } from '../enum/ChatMessageType';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  title = 'app';
  username: string;
  role: string;
  content: string;
  private color: string[] = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0']
  messaggi: ChatMessage[] = [];
  topic: string;
  user: User = new User();
  room: Room = new Room();

  public delete: boolean = false;
  public stompClient: Stomp.Client = null;
  topicSubscription: Stomp.StompSubscription = null;
  ChatMessageType = ChatMessageType;
  @ViewChild('scroll') private myScrollContainer: ElementRef;


  constructor(private urlPath: UrlPath,
    private userService: UserService,
    private roomService: RoomService,
    private route: Router,
    private messageService: MessageService,
    private loginService: LoginService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.topic = '/topic/public';
    this.user = this.loginService.getConnectedUser();
    this.loginService.connectApplication(this.user.id).subscribe(isConnected => {
      if (this.loginService.stompClient.connected) {
        this.stompClient = this.loginService.stompClient;
        this.getRoom("public");
      }
    });
  }

  getRoom(topicTitle: string) {
    this.room.creator = this.user;
    this.room.title = topicTitle;
    this.topic = '/topic/'.concat(topicTitle);
    let room = new Room();
    room.title = topicTitle;

    this.roomService.getStanza(room).subscribe(room => {
      this.room = room[0];
      this.getUser();
    }, err => console.log("errore recupero info stanza", err));
  }

  getUser() {
    let user: User = new User();
    user.username = this.username;
    this.userService.getUtente(user).toPromise().then(
      userData => {
        this.user = userData[0];
        this.loadMessages();
      },
      error => {
        console.log('Error get user', error);
      }
    )
  }



  loadMessages() {
    //necessaria poichè la variabile messaggi risulta undefined all'interno della connect
    this.messaggi = [];
    const mex = this.messaggi;

    // argomenti della connect -> primo : header , secondo: callback , terzo: error
    this.topicSubscription = this.stompClient.subscribe(this.topic, function (payload) {
      let message = new ChatMessage();
      message = JSON.parse(payload.body);
      if (message.type === ChatMessageType.JOIN) {
        message.content = message.sender.username + ' joined!';
      } else if (message.type === ChatMessageType.LEAVE) {
        message.content = message.sender.username + ' left!';
      }
      mex.push(message);
    });

    //Invio Username - TODO: decidere se farlo BE
    let messageJoinUser = new ChatMessage();
    messageJoinUser.sender = this.user;
    messageJoinUser.type = ChatMessageType.JOIN;
    messageJoinUser.room = this.room;
    console.log(JSON.stringify({ messageJoinUser }.messageJoinUser));
    this.stompClient.send('/app/chat.addUser', {}, JSON.stringify({ messageJoinUser }.messageJoinUser));
  }


  sendMessage(content: string) {

    //Controllo se esiste la connessione e il messaggio
    if (content && this.stompClient) {

      //Creo l'oggetto messaggio
      let chatMessage = new ChatMessage();
      chatMessage.sender = this.user;
      chatMessage.type = ChatMessageType.CHAT;
      chatMessage.room = this.room;
      chatMessage.content = content;

      this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
      this.content = '';
    }
  }

  onError() {
    console.log('Errore nella comunicazione con WebSocket')
  }

  //Funzione per ricavare i colori dei mittenti
  applyStyle(sender) {
    let i = 0;
    for (i = 0; i < sender.length; i++) {
      i = 31 * i + sender.charCodeAt(i);
    }
    var indexOfColour = Math.abs(i % this.color.length)
    const styles = { 'background': this.color[indexOfColour] };
    return styles;
  }


  changeRoom(titleTopic: string) {
    this.topicSubscription.unsubscribe();
    let chatMessage = new ChatMessage();
    chatMessage.sender = this.user;
    chatMessage.type = ChatMessageType.LEAVE;
    chatMessage.room = this.room;
    chatMessage.content = '';
    this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
    this.getRoom(titleTopic);
  }

  clickDelete(messaggio: ChatMessage) {
    // if (messaggio.type == ChatMessageType.CHAT && localStorage.getItem("role") == 'ADMIN') {
    //   if (this.delete) {
    //     this.delete = false;
    //   }
    //   else this.delete = true;
    //   this.messageService.eliminaMessaggio(messaggio.id).subscribe(
    //     data => {
    //       this.oldMessaggi = this.oldMessaggi.filter(mex => mex.id != messaggio.id);
    //       this.messaggi = this.messaggi.filter(mex => mex.id != messaggio.id);
    //       console.log(data);
    //       console.log("MESSAGGI ", this.messaggi);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   )
    // }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    // logout 
    this.loginService.disconnectApplication();
    // room disconnection
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }
}