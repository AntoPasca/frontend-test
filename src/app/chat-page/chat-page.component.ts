import { ForwardChatMessage, IncomingChatMessage } from '../dto/ChatMessage';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { User } from '../dto/User';
import { RoomService } from '../service/room-service';
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
  room: Room;

  public delete: boolean = false;
  public stompClient: Stomp.Client = null;
  topicSubscription: Stomp.StompSubscription = null;
  ChatMessageType = ChatMessageType;
  @ViewChild('scroll') private myScrollContainer: ElementRef;


  constructor(
    private roomService: RoomService,
    private loginService: LoginService,
    private messageService: MessageService) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit() {
    this.user = this.loginService.getConnectedUser();
    this.loginService.connectApplication(this.user.id).subscribe(isConnected => {
      if (this.loginService.stompClient.connected) {
        this.stompClient = this.loginService.stompClient;
      }
    });
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


  changeRoom(titleTopic: string) {
    if (this.selectedRooms === null || this.selectedRooms.length === 0) { // seleziona una stanza
      this.selectedRoom = titleTopic;
      this.selectedRooms.push(this.selectedRoom);
      this.activateRoom();
    } else if (this.selectedRooms.length >= 1 && this.selectedRoom === titleTopic) { // deseleziona stanza 
      this.deactivateRoom();
      this.selectedRoom = null;
      this.selectedRooms.splice(0, 1);
    } else if (this.selectedRooms.length >= 1 && this.selectedRoom !== titleTopic) { // seleziona un'altra stanza diversa da quella già selezionata
      this.deactivateRoom();
      this.selectedRoom = titleTopic;
      this.selectedRooms.splice(0, 1);
      this.selectedRooms.push(this.selectedRoom);
      this.activateRoom();
    }
  }

  activateRoom() {
    this.topic = '/topic/'.concat(this.selectedRoom);
    let room = new Room();
    room.title = this.selectedRoom;
    // recupera info stanza 
    this.roomService.getStanza(room).subscribe(room => {
      this.room = room[0];
      this.connectToRoom();
    }, err => console.log("errore recupero info stanza", err));
  }

  deactivateRoom() {
    // cancella sottoscrizione a room corrente
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
    // invio messaggio di leave
    if (this.room != null && this.user != null) {
      this.stompClient.send("/app/chat.leave", {}, JSON.stringify({ 'userID': this.user.id, 'roomID': this.room.id }));
    }
  }

  connectToRoom() {
    this.messaggi = [];

    // recupera messaggi precedenti
    let msgSubscription = this.messageService.getMessaggi(this.user.id, this.room.id).subscribe(messaggi => {
      this.messaggi = messaggi;
      console.log("messaggiGet", this.messaggi);
    }, err => alert("errore recupero messaggi"), () => {
      msgSubscription.unsubscribe();
    });


    // incoming messages
    this.topicSubscription = this.stompClient.subscribe(this.topic, (payload) => {
      let message = new IncomingChatMessage();
      message = JSON.parse(payload.body);
      this.messaggi.push(message);
      console.log("messaggi", this.messaggi);
    });

    //Invio messaggio di join 
    if (this.room != null && this.user != null) {
      this.stompClient.send('/app/chat.join', {}, JSON.stringify({ 'userID': this.user.id, 'roomID': this.room.id }));
    }
  }


  clickDelete(messaggio: ForwardChatMessage) {
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

  // for seletion of rooms
  selectable = true;
  rooms = [
    { name: 'public' },
    { name: 'sport' },
    { name: 'lavoro' }
  ];

  selectedRooms: any[] = [];
  selectedRoom;

  isSelected(room: any): boolean {
    const index = this.selectedRooms.indexOf(room);
    return index >= 0;
  }
}