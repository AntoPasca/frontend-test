import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user-service';
import { User } from '../dto/User';
import * as Stomp from '@stomp/stompjs';
import { LoginService } from '../service/login.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit {

  columnsToDisplay = ['username', 'isOnline', 'lastAccess'];

  utenti: Array<User> = [];
  topicSubscription: Stomp.StompSubscription = null;
  stompClient: Stomp.Client;
  dataSource = new MatTableDataSource<User>();

  constructor(private userService: UserService, private loginService: LoginService) { }

  ngOnInit() {

    this.stompClient = this.loginService.stompClient;
    if (this.stompClient.connected) {
      this.userService.getUtenti().subscribe(users => {
        this.utenti = users;
        this.dataSource.data = this.utenti;
        this.stayUpdateIfThereAreAnyoneOnline();
      });
    }
  }

  stayUpdateIfThereAreAnyoneOnline() {
    const topic = "/topic/online";
    this.topicSubscription = this.stompClient.subscribe(topic, (payload) => {
      let updatedUser = new User;
      updatedUser = JSON.parse(payload.body);
      this.searchAndSetState(updatedUser);
    });
  }


  searchAndSetState(updatedUser: User) {
    const utenteTrovato = this.utenti.find(utente => utente.id === updatedUser.id);
    if (utenteTrovato) {
      let index = this.utenti.indexOf(utenteTrovato);
      this.utenti.splice(index, 1);
      this.utenti.push(updatedUser);
      this.dataSource.data = this.utenti;
    }
  }


  private color: string[] = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
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



  ngOnDestroy() {
    // logout 
    // ---
    // disattiva ricerca utenti online
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }

}
