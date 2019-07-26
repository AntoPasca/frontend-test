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

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  title = 'app';
  username: string;
  content: string;
  private color: string[] = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0']
  messaggi: ChatMessage[] = [];
  oldMessaggi: ChatMessage[] = [];
  topic: string;
  user: User = new User();
  room: Room = new Room();
  stompSubscription: Subscription;
  public connected: boolean = false;
  public stompClient = null;
  ChatMessageType = ChatMessageType;
  @ViewChild('scroll') private myScrollContainer: ElementRef;


  constructor(private urlPath: UrlPath, private userService: UserService, private roomService: RoomService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.topic = '/topic/public';
    this.getRoom("public");
  }

  getRoom(topicTitle: string) {
    this.room.creator = this.user;
    this.room.title = this.topic;
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
        this.connect();
      },
      error => {
        console.log('Error get user', error);
      }
    )
  }



  connect() {
    if (this.username && this.messaggi) {
      const socket = new SockJS(this.urlPath.webSocketChatUrl);

      // Stomp.over funziona solo con la versione 4.0.7 di @stomp/stompjs
      this.stompClient = Stomp.over(socket);

      let chatMessageExample = new ChatMessage();
      chatMessageExample.room = this.room;

      this.roomService.getMessages(this.room.id, chatMessageExample).toPromise().then(
        messagges => {
          this.oldMessaggi = messagges;
          console.log("old messages", this.oldMessaggi);
        },
        err => {
          console.log(err);
        }
      )
      //necessaria poichè la variabile messaggi risulta undefined all'interno della connect
      const mex = this.messaggi;

      // argomenti della connect -> primo : header , secondo: callback , terzo: error
      this.stompClient.connect({}, () => {
        //Subscribe al topic public
        this.connected = true;
        this.stompSubscription = this.stompClient.subscribe(this.topic, function (payload) {

          let message = new ChatMessage();
          message = JSON.parse(payload.body);

          if (message.type === ChatMessageType.JOIN) {
            message.content = message.sender.username + ' joined!';
          } else if (message.type === ChatMessageType.LEAVE) {
            message.content = message.sender.username + ' left!';
          }
          mex.push(message);
        });

        //Invio Username
        let messageJoinUser = new ChatMessage();
        messageJoinUser.sender = this.user;
        messageJoinUser.type = ChatMessageType.JOIN;
        messageJoinUser.room = this.room;
        console.log(JSON.stringify({ messageJoinUser }.messageJoinUser));
        this.stompClient.send('/app/chat.addUser', {}, JSON.stringify({ messageJoinUser }.messageJoinUser));

      }, this.onError);
    }
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
    this.stompSubscription.unsubscribe();
    this.getRoom(titleTopic);
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnDestroy() {
    if (this.stompSubscription) {
      this.stompSubscription.unsubscribe();
    }
  }
}