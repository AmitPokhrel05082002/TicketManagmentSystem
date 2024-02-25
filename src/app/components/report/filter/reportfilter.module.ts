import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportfilterRoutingModule } from './reportfilter-routing.module';
import { reportfilterComponent } from './reportfilter.component';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReportfilterRoutingModule
	],
	declarations: [reportfilterComponent],
})
export class FileDemoModule { }
