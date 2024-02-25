import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
    authPage:boolean = true;

    fullName:string;
    username:string;
    password:string;

    showSpinner: boolean = false;

    constructor(private authService: AuthService, private router:Router, private messageService: MessageService) {}

    signup() {
        this.showSpinner = true;
        this.authService.signup(this.fullName, this.username, this.password, 'user').subscribe(response => {
        console.log(response); // Handle the response accordingly
        this.showSpinner = false;
        this.showSignUp()
        this.switchToLogin()
        },(Error)=>{
            this.showSpinner = false;
            this.showErrorSignUp()
            console.log(Error);
        });
    }

    login() {
        this.showSpinner = true;
        this.authService.login(this.username, this.password).subscribe(response => {
        console.log(response); // Handle the response accordingly
        const token = response.access_token; // Replace with the actual token received from the server
        localStorage.setItem('access_token', token);
        const decodedToken = jwtDecode(token);
        localStorage.setItem('userId', decodedToken['userId'])
        localStorage.setItem('role', decodedToken['role'])
        localStorage.setItem('fullName', decodedToken['fullName'])
        this.show()
        console.log(decodedToken);
        },(Error) => {
            this.showSpinner = false;
            this.showError()
            console.log(Error);
        });
    }

    switchToSignUp(){
        this.authPage = false;
        this.reset();
    }

    switchToLogin(){
        this.authPage = true;
        this.reset();
    }

    reset(){
        this.fullName = '',
        this.username = '',
        this.password = ''
    }

    show() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Login Successful !' });
        setTimeout(() => {
        this.router.navigate(['/ticket/home'])
        }, 500);
    }
    showSignUp() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Sign Up Successful !' });
        setTimeout(() => {
        this.router.navigate(['/ticket/home'])
        }, 500);
    }
    showError() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed To Login !' });
    }
    showErrorSignUp() {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed To Sign Up !' });
    }
}
