import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private httpClient: HttpClient) {
  }

  createTicket(payload:any){
    return this.httpClient.post('http://localhost:3000/tickets', payload)
  }

  getTicket(){
    return this.httpClient.get('http://localhost:3000/tickets')
  }

  getTicketByUserId(userId:any){
    return this.httpClient.get(`http://localhost:3000/tickets/byCreatedBy/${userId}`)
  }

  getTicketById(ticketId:number){
    const payload = {
        ticketId : ticketId
    }
    return this.httpClient.post('http://localhost:3000/tickets/byId', payload)
  }

//   private ticketDetailsSubject = new BehaviorSubject<any>({
//     subject: 'This is the sample of the subject',
//     description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit...',
//     replies: [],
//   });

  getTicketAttachmentByName(name: string): Observable<any> {
    const payload = { name };
    return this.httpClient.post<any>('http://localhost:3000/tickets/GetFile', payload);
  }

  getRepliedTicketAttachmentByName(name: string): Observable<any> {
    const payload = { name };
    return this.httpClient.post<any>('http://localhost:3000/tickets-replies/GetFile', payload);
  }


//   ticketDetails$ = this.ticketDetailsSubject.asObservable();

createTicketReply(ticketId: number, message: string, send_by: string, attachment: string): Observable<any> {
    const body = {
      message,
      send_by,
      attachment
    };
    console.log(body);
    return this.httpClient.post(`http://localhost:3000/tickets-replies/reply/${ticketId}`, body);
}


  getTicketReplies(ticketId: number): Observable<any> {
    return this.httpClient.get(`http://localhost:3000/tickets-replies/${ticketId}`);
  }

  //updating the status and updated time
  updateTicket(id: number, updatedTicketData: any) {
    return this.httpClient.put(`http://localhost:3000/tickets/${id}`, updatedTicketData);
  }

}
