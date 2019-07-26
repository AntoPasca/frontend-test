import { Conversation } from './../dto/Conversation';
import { UserService } from './../service/user-service';
import { ChatMessage } from '../dto/ChatMessage';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { WebsocketService } from '../service/websocket-service';
import { UrlPath } from '../app.costants';
import { User } from '../dto/User';
import { Subscription } from 'rxjs';

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
  user : User = new User();
  conversation : Conversation = new Conversation();
  stompSubscription : Subscription;
  public connected: boolean = false;
  public stompClient = null;
  @ViewChild('scroll') private myScrollContainer: ElementRef;


  constructor(private webSocketService: WebsocketService, private urlPath: UrlPath, private userService : UserService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit(){
    this.username = localStorage.getItem("username");
    this.topic = '/topic/public';
    this.getUser();
  }

  getUser(){
    let user : User = new User();
    user.username = this.username;
    this.userService.getUtente(user).toPromise().then(
      userData => {
        this.user = userData[0];
        this.getConversation();
      },
      error => {
        console.log('Error get user', error);
      }
    )
  }

  getConversation(){
    this.conversation.creator = this.user;
    this.conversation.title = this.topic;
    this.connect();
  }

  connect() {
    if (this.username && this.messaggi) {
      const socket = new SockJS(this.urlPath.webSocketChatUrl);

      // Stomp.over funziona solo con la versione 4.0.7 di @stomp/stompjs
      this.stompClient = Stomp.over(socket);
      let username = this.username;
      this.webSocketService.getMessage().toPromise().then(
        messagges => {
          this.oldMessaggi = messagges;
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

          if (message.type === 'JOIN') {
            message.content = message.sender.username + ' joined!';
          } else if (message.type === 'LEAVE') {
            message.content = message.sender.username + ' left!';
          }
          mex.push(message);
        });

        //Invio Username
        let messageJoinUser = new ChatMessage();
        messageJoinUser.sender = this.user;
        messageJoinUser.type = 'JOIN';
        messageJoinUser.conversation = this.conversation;
        console.log(JSON.stringify({messageJoinUser}.messageJoinUser));
        this.stompClient.send('/app/chat.addUser', {}, JSON.stringify( {messageJoinUser}.messageJoinUser ));

      }, this.onError);
    }
  }


  sendMessage(message: string) {

    //Controllo se esiste la connessione e il messaggio
    if (message && this.stompClient) {

      //Creo l'oggetto messaggio
      let chatMessage = new ChatMessage();
      // chatMessage.sender = this.username;
      chatMessage.content = message;
      chatMessage.type = 'CHAT';

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

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  ngOnDestroy(){
    if(this.stompSubscription){
      this.stompSubscription.unsubscribe();
    }
  }
}