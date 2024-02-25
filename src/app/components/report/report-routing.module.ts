import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'file', data: { breadcrumb: 'File' }, loadChildren: () => import('./filter/reportfilter.module').then(m => m.FileDemoModule) },
    ])],
    exports: [RouterModule]
})
export class ReportRoutingModule { }
