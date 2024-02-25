import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { reportfilterComponent } from './reportfilter.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: reportfilterComponent }
	])],
	exports: [RouterModule]
})
export class ReportfilterRoutingModule { }
