import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "src/app/service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService]
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private router:Router, private messageService: MessageService) { }

    logout(){
        localStorage.clear();
        sessionStorage.clear();
        this.show()
    }

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Logout Successful !' });
        setTimeout(() => {
        this.router.navigate(['/'])
        }, 500);
    }
}
