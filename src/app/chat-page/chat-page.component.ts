import { ChatMessage } from '../dto/ChatMessage';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { WebsocketService } from '../service/websocket-service';
import { UrlPath } from '../app.costants';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {
  title = 'app';
  name: string;
  content: string;
  private color: string[] = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0']
  messaggi: ChatMessage[] = [];
  oldMessaggi: ChatMessage[] = [];
  public connected: boolean = false;
  public stompClient = null;
  @ViewChild('scroll') private myScrollContainer: ElementRef;


  constructor(private webSocketService: WebsocketService, private urlPath: UrlPath) { }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnInit(){
    this.name = localStorage.getItem("username");
    this.connect();
  }

  connect() {
    if (this.name) {
      const socket = new SockJS(this.urlPath.webSocketChatUrl);

      // Stomp.over funziona solo con la versione 4.0.7 di @stomp/stompjs
      this.stompClient = Stomp.over(socket);
      let name = this.name;
      this.webSocketService.getMessage().subscribe(
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
        this.stompClient.subscribe('/topic/public', function (payload) {

          let message = new ChatMessage();
          message = JSON.parse(payload.body);

          if (message.type === 'JOIN') {
            message.content = message.sender + ' joined!';
          } else if (message.type === 'LEAVE') {
            message.content = message.sender + ' left!';
          }
          mex.push(message);
        });

        //Invio Username
        this.stompClient.send('/app/chat.addUser', {}, JSON.stringify({ sender: name, type: 'JOIN' }));

      }, this.onError);
    }
  }


  sendMessage(message: string) {

    //Controllo se esiste la connessione e il messaggio
    if (message && this.stompClient) {

      //Creo l'oggetto messaggio
      let chatMessage = new ChatMessage();
      chatMessage.sender = this.name;
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
}