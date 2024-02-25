import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { CustomerService } from './service/customer.service';
import { IconService } from './service/icon.service';
import { DocumentComponent } from './components/document/document.component';
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { LoginComponent } from './login/login.component';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    declarations: [
        AppComponent,
        DocumentComponent,
        CreateTicketComponent,
        TicketDetailsComponent,
        LoginComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        FormsModule,
        InputTextModule,
        EditorModule,
        FileUploadModule,
        HttpClientModule,
        CommonModule,
        ReactiveFormsModule,
        ToastModule,
        ProgressSpinnerModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
         CustomerService,IconService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
