import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ServiceService } from 'src/app/service/service.service';
import * as PDFObject from 'pdfobject';
import { Socket, io } from 'socket.io-client';
import { FileUpload } from 'primeng/fileupload';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
  providers: [MessageService]
})
export class TicketDetailsComponent {
    ticketDetails: any = {}; // Initialize with a default empty object
    replyText: string = '';
    ticketId: any;
    textReplies: any;
    fileNames:any;
    pdfObject:any;
    @ViewChild('pdfViewer', { static: true }) pdfViewer: ElementRef;
    socket: Socket;
    showPdfViewer: boolean = false;
    showRepliedPdfViewer: boolean[] = [];
    sendBy = localStorage.getItem('fullName')
    showSpinner: boolean = false;
    @ViewChild('fileUpload') fileUpload: FileUpload;
    isUploadFile:boolean = false;
    ticketStatus:string;

    constructor(private ticketService: ServiceService, private route: ActivatedRoute,  private http:HttpClient, private messageService: MessageService, private cdr: ChangeDetectorRef) {
        this.socket = io('ws://localhost:3000');

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    this.socket.on('get-ticket-reply', (message) => {
      console.log(message)
      const messageFromServer = message.data;
      this.socketFunctionToTrigger(messageFromServer);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket connection closed:', reason);
    });
        this.route.queryParams.subscribe((params: Params) => {
            // Access query parameters here
            this.ticketId = params['GetTheValueByID'];
        });
        this.ticketService.getTicketById(this.ticketId).subscribe((res)=>{
            this.ticketDetails = res
        })
    }

    ngOnInit(): void {
      this.cdr.detectChanges();
      this.ticketService.getTicketReplies(this.ticketId).subscribe((res) => {
        console.log(res)
        this.textReplies = res.reverse();
      })
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
    socketFunctionToTrigger(messageFromServer){
        console.log(messageFromServer, + 'triggered')
        this.ticketService.getTicketReplies(this.ticketId).subscribe((res) => {
            console.log(res)
            this.textReplies = res.reverse();
        })
        this.showNotification()
    }

    uploadFile(fileUpload: FileUpload): void {
        console.log(fileUpload.files[0].name);
        const formData = new FormData();
        formData.append('file', fileUpload.files[0]);  // Append the file, not just the file name
        formData.append('additionalDataKey', 'additionalDataValue');

        this.http.post('http://localhost:3000/tickets-replies/replied-file', formData, { responseType: 'text' }).subscribe(
            (response) => {
                console.log('Server Response:', response);
            },
            (error) => {
                console.error('Error uploading file:', error);

                // Check if the error response is a non-JSON response
                if (error instanceof HttpErrorResponse && error.error instanceof ProgressEvent) {
                    console.log('Non-JSON response:', error.error);

                    // Handle non-JSON response
                    // You might want to display an error message to the user or take appropriate action
                } else {
                    // Handle other errors (JSON parsing errors, etc.)
                    console.log('Full Error Response:', error);
                    // Handle error
                    // You may want to check error.status, error.statusText, etc.
                }
            }
        );
    }

    submitReply(fileUpload: FileUpload): void {
        this.updateTheTicketDetails()
        this.showSpinner = true
        const attachment = fileUpload.files[0]?.name || 'N/A';
        this.ticketService.createTicketReply(Number(this.ticketId), this.replyText, this.sendBy, attachment).subscribe((res) => {
        if(this.isUploadFile){
            this.uploadFile(fileUpload);
        }
        this.showSpinner = false
        this.show()
        this.reset()
        }, (error)=>{
            this.showSpinner = false
            this.showError()
        });
    }

    reset(){
        this.replyText = ''
        this.fileUpload.clear();
    }

    onUpload(event: any): void {
        try {
          const response = event.originalEvent.body;
          console.log('Parsed Server Response:', response);

          if (response && response.success === true) {
            this.isUploadFile = true
            console.log('File upload successful!');
            // Handle success logic here
          } else {
            console.log('File upload failed or response does not contain success:true');
            // Handle failure logic here
          }
        } catch (error) {
          console.error('Error parsing response:', error);
        }
      }

    togglePdfViewer(): void {
      }
    getTicketFileByName(attachmentName:string){
        this.showPdfViewer = !this.showPdfViewer; // Toggle the value

       this.ticketService.getTicketAttachmentByName(attachmentName).subscribe(  (response) => {
        console.log(response);
        this.fileNames=response
        this.handleRenderPdf(response)
        // Process the response data here
        },
        (error) => {
        console.error(error);
        // Handle the error here
        })
    }
    getRepliedTicketFileByName(attachmentName:string, index:any){
        console.log(attachmentName)
        // this.showRepliedPdfViewer = !this.showRepliedPdfViewer; // Toggle the value
        this.showRepliedPdfViewer[index] =  !this.showRepliedPdfViewer[index];
       this.ticketService.getRepliedTicketAttachmentByName(attachmentName).subscribe(  (response) => {
        console.log(response);
        this.fileNames=response
        this.handleRenderPdfForRepliedTicket(response)
        // Process the response data here
        },
        (error) => {
        console.error(error);
        // Handle the error here
        })
    }
    handleRenderPdf(data:any) {
        try {
            const fileName: string = data[0];
            const pdfFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

            console.log('PDF file name:', pdfFileName);

            // Use PDFObject to embed the PDF
            this.pdfObject = PDFObject.embed(`http://localhost:3000/${pdfFileName}`, '#pdfContainer');
        } catch (error) {
            console.error('Error embedding PDF:', error);
        }
    }

    handleRenderPdfForRepliedTicket(data:any){
        console.log(data)
        try {
            const fileName: string = data[0];
            console.log(data)
            const pdfFileName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

            console.log('PDF file name:', pdfFileName);

            // Use PDFObject to embed the PDF
            this.pdfObject = PDFObject.embed(`http://localhost:3000/${pdfFileName}`, '#pdfContainerForRepliedTicket');
        } catch (error) {
            console.error('Error embedding PDF:', error);
        }
    }

    updateTheTicketDetails(){
        const payload = {
            status:this.ticketStatus
        }
        this.ticketService.updateTicket(this.ticketId, payload).subscribe((res)=>{
            console.log(res)
        },(error)=>{
            console.log(error)
        })
    }

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Replied Successfully !' });
    }

    showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed To Reply !' });
    }

}
