import { ForwardChatMessage, IncomingChatMessage } from '../dto/ChatMessage';
import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { User } from '../dto/User';
import { Room } from '../dto/Room';
import { ChatMessageType } from '../enum/ChatMessageType';
import { LoginService } from '../service/login.service';
import { MessageService } from '../service/message-service';

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
  messaggi: IncomingChatMessage[] = [];
  topic: string;
  user: User;

  @Input() room: Room;

  ngOnChanges(simpleChanges: SimpleChanges) {
    // sottoscriviti a una nuova stanza
    if (simpleChanges.room.currentValue) {
      this.loadAndListenMessagesFrom();
    } else {
      // invio messaggio di leave nella stanza precedente se c'è.
      if (simpleChanges.room.previousValue && this.user != null) {
        this.stompClient.send("/app/chat.leave", {}, JSON.stringify({ 'userID': this.user.id, 'roomID': simpleChanges.room.previousValue.id }));
      }
      if (this.topicSubscription) {
        this.topicSubscription.unsubscribe();
      }
    }
  }

  public delete: boolean = false;
  public stompClient: Stomp.Client = null;
  topicSubscription: Stomp.StompSubscription = null;
  ChatMessageType = ChatMessageType;
  @ViewChild('scroll') private myScrollContainer: ElementRef;


  constructor(
    private loginService: LoginService,
    private messageService: MessageService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.stompClient = this.loginService.stompClient;
    this.user = this.loginService.getConnectedUser();
  }

  sendMessage(content: string) {
    //Controllo se esiste la connessione e il messaggio
    if (content && this.stompClient) {
      //Creo l'oggetto messaggio
      let chatMessage = new ForwardChatMessage();
      chatMessage.userID = this.user.id;
      chatMessage.roomID = this.room.id;
      chatMessage.content = content;
      this.stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
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

  loadAndListenMessagesFrom() {
    this.messaggi = [];

    // recupera messaggi precedenti
    let msgSubscription = this.messageService.getMessaggi(this.user.id, this.room.id).subscribe(messaggi => {
      this.messaggi = messaggi;

      // incoming messages
      const topic = "/topic/".concat(this.room.title);
      this.topicSubscription = this.stompClient.subscribe(topic, (payload) => {
        let message = new IncomingChatMessage();
        message = JSON.parse(payload.body);
        this.messaggi.push(message);
      });

      //Invio messaggio di join 
      if (this.room != null && this.user != null) {
        this.stompClient.send('/app/chat.join', {}, JSON.stringify({ 'userID': this.user.id, 'roomID': this.room.id }));
      }

    }, err => alert("errore recupero messaggi"), () => {
      msgSubscription.unsubscribe();
    });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    // TODO: implementare il logout 
    this.loginService.disconnectApplication();
  }
}