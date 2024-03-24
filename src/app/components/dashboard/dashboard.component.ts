import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { ServiceService } from 'src/app/service/service.service';


@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    socket: Socket;
    ticketList:any;
    role:string;
    userId:any;
    isAdmin:boolean = false;

   constructor(private service:ServiceService, private router:Router) {
    this.role = localStorage.getItem('role');
    console.log(this.role)
    this.userId = localStorage.getItem('userId');
    this.socket = io('ws://localhost:3000');

    this.socket.on('connect', () => {
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('create-ticket', (message) => {
      const messageFromServer = message.data;
      this.socketFunctionToTrigger(messageFromServer);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket connection closed:', reason);
    });
  }

  socketFunctionToTrigger(messageFromServer){
    if(this.role === 'admin'){
        this.getTicketInfo()
        this.isAdmin = true
        this.showNotification()
    }else{
        this.getTicketBasedOnUserId()
    }
  }

  showNotification() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("You have a new notification!");
    } else if (Notification.permission !== "denied") {
      // Otherwise, we need to ask the user for permission
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("You have a new notification!");
        }
      });
    }
  }


  ngOnInit() {
    if(this.role === 'admin'){
        this.getTicketInfo()
        this.isAdmin = true
    }else{
        this.getTicketBasedOnUserId()
    }
  }

  getTicketInfo(){
    this.service.getTicket().subscribe((res)=>{
        this.ticketList = res;
        this.getObjectKeys(res);
    })
  }

  getTicketBasedOnUserId(){
    this.service.getTicketByUserId(this.userId).subscribe((res)=>{
        this.ticketList = res;
        this.getObjectKeys(res);
    })
  }

  getObjectKeys(obj: any): string[] {
    return Object.keys(obj).filter(key => key !== 'attachment' && key !== 'created_by' && key !== 'updated_by' && key !== 'description');
  }

  getPriorityCount(priority: string): number {
    return this.ticketList.filter(item => item.priority === priority).length;
  }

  navigate(id:any){
    const navigationExtras: NavigationExtras = {
    queryParams: { 'GetTheValueByID': id },
    };

    this.router.navigate(['/ticket/ticket-details'], navigationExtras);
  }

}
