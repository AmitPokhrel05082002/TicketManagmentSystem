import { Component, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';
import { FileUpload } from 'primeng/fileupload';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  providers: [MessageService]
})
export class CreateTicketComponent {
    name:string;
    priority:string;
    subject:string;
    description:string;
    attachment:string;
    created_by:string;
    @ViewChild('fileUpload') fileUpload: FileUpload;

    showSpinner: boolean = false;
    isUploadFile:boolean = false;

    constructor(private service:ServiceService, private http:HttpClient, private messageService: MessageService){}

    ngOnInit(){

    }

    onUpload(event: any): void {
        try {
          const response = event.originalEvent.body;
          console.log('Parsed Server Response:', response);

          if (response && response.success === true) {
            console.log('File upload successful!');
            this.isUploadFile = true
            // Handle success logic here
          } else {
            console.log('File upload failed or response does not contain success:true');
            // Handle failure logic here
          }
        } catch (error) {
          console.error('Error parsing response:', error);
        }
      }

      // Function to handle the file upload
      uploadFile(fileUpload: FileUpload): void {
        console.log(fileUpload.files[0].name)
        const formData = new FormData();
        formData.append('file', fileUpload.files[0]);
        formData.append('additionalDataKey', 'additionalDataValue');

        this.http.post('http://localhost:3000/tickets/file', formData, { responseType: 'text' }).subscribe(
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

    submit(fileUpload: FileUpload){
    this.showSpinner = true
    const payload = {
        "name": this.name,
        "priority": this.priority,
        "subject": this.subject,
        "description": this.description,
        "attachment": fileUpload.files[0]?.name || 'N/A',
        "created_by": localStorage.getItem('userId'),
        "created_at": new Date()
    }
    if(this.isUploadFile){
        this.uploadFile(fileUpload);
    }
    this.service.createTicket(payload).subscribe((res) => {
        this.reset()
        this.showSpinner = false
        this.show()
    },(error)=>{
        console.log(error)
        this.showSpinner = false
        this.showError()
    })
    }

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Ticket Send Successfully !' });
    }

    showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed To Send Ticket !' });
    }

    reset(){
        this.name = ''
        this.priority = ''
        this.subject = ''
        this.description = ''
        this.fileUpload.clear();
    }
}
