import { Component, OnInit } from '@angular/core';
import { Room } from '../dto/Room';
import { RoomService } from '../service/room-service';
import { LoginService } from '../service/login.service';
import { User } from '../dto/User';
import * as Stomp from '@stomp/stompjs';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {



  selectedRooms: any[] = [];
  selectedRoom;
  room: Room;     // stanza selezionata - emette eventi per chat-page component
  rooms: Room[];  // stanze totali sul db
  user: User;
  stompClient: Stomp.Client = null;
  chipList;

  constructor(private roomService: RoomService, private loginService: LoginService) { }

  ngOnInit() {
    this.stompClient = this.loginService.stompClient;
    this.user = this.loginService.getConnectedUser();
    // recupera tutte le stanze
    this.roomService.getStanza(new Room()).subscribe(stanze => {
      this.rooms = stanze;
    })
  }


  isSelected(room: any): boolean {
    const index = this.selectedRooms.indexOf(room);
    return index >= 0;
  }

  // ogni volta che viene settato room viene scatenato onchange in chat-page
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
    let room = new Room();
    room.title = this.selectedRoom;
    // recupera info stanza 
    this.roomService.getStanza(room).subscribe(stanza => {
      this.room = stanza[0];
      // JOIN
    }, err => console.log("errore recupero info stanza", err));
  }

  deactivateRoom() {
    this.room = null;
  }
}
