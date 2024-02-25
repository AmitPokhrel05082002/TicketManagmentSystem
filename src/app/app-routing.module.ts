import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
// import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { CreateTicketComponent } from './components/create-ticket/create-ticket.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path:'', component:LoginComponent},
            { path: 'login-page', component:LoginComponent},
            {
                path: 'ticket', component: AppLayoutComponent, canActivate: [AuthGuard],
                children: [
                    { path: 'home', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'create-ticket',  component:CreateTicketComponent},
                    { path: 'ticket-details',  component:TicketDetailsComponent},
                ]
            },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
