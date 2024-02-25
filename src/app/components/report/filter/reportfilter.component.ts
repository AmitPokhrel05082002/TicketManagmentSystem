import { MessageService } from 'primeng/api';import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Customer } from 'src/app/model/model';
import { CustomerService } from 'src/app/service/customer.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import * as PDFObject from 'pdfobject';

@Component({
    templateUrl: './reportfilter.component.html',
    providers: [MessageService]
})
export class reportfilterComponent {

    pdfData:any;
    isLoading = false;
    pdfObject:any;



  FirstConditionOnly:boolean = false;
  noDataFound:boolean = false;

  licenseData: [] | undefined;

  // selectedLicense: any;

  selectedLicense: string = '';

  columnOfSelectedLicense: any;

  customers!: Customer[];

  value: string | undefined;

  visible: boolean = false;

  TableData: any;

  tableHead: any;

  // firstInput: any;

  secondInput: string = '';

  ThirdInput: string = '';

  FourthInput: string = '';

  DataType: any

  condition_operator: any

  searchTerm: any

  fields: any;

  current_page: number = 1;

  set_limit: number[] = [10, 20, 50, 100, 200];

  selectedlimit: number = this.set_limit[0];

  // API_URL = "http://127.0.0.1:8000/";

  API_URL = "http://192.168.123.148:8000/";

  limit_value: any = 10;

  offset: number = 0;

  totalEntries: any;

  total_pages: any;

  pages: any;

  pagesArray: any[] = [];

  loading: boolean = false;

  dataAvailable: boolean = false;

  onAddFilterFlag: boolean = false;

  onFilterModelOpen: boolean = false;

  DataTypeForNameField: any;

  firstInput: string = '';



  @ViewChild('content') content:ElementRef;
  selected: string;
  constructor(private CustomerService: CustomerService, private http: HttpClient) { }

private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(data);

    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();

    // Release the object URL to avoid memory leaks.
    window.URL.revokeObjectURL(url);
  }

  ngOnInit() {
    this.CustomerService.getViews().subscribe((Response) => {
    this.licenseData = Response.views;
    });

    this.DataType = [
      { name: 'equals' },
      { name: 'not equal' },
      { name: 'contains' },
      { name: 'is null' },
      { name: 'distinct' },
      { name: 'in' },
      { name: 'not in' },
      { name: 'greater than' },
      { name: 'less than' }
    ];

    this.condition_operator = [
      { name: 'AND' },
      { name: 'OR' }
    ]

  }

  setSecondInputBasedOnField() {
    if (this.firstInput === 'Name' || this.firstInput === 'Dzongkhag') {
      this.DataType = [
      { name: 'equals' },
      { name: 'not equal' },
      { name: 'contains' },
      { name: 'is null' },
      { name: 'distinct' },
      { name: 'in' },
      { name: 'not in' },
    ];
    } else {
      this.DataType = [
      { name: 'equals' },
      { name: 'not equal' },
      { name: 'contains' },
      { name: 'is null' },
      { name: 'distinct' },
      { name: 'in' },
      { name: 'not in' },
      { name: 'greater than' },
      { name: 'less than' }
    ];
    }
  }


  onLicenseSelected() {
  this.CustomerService.get_columns(this.selectedLicense).subscribe((columnsResponse) => {
    console.log(columnsResponse)
    this.columnOfSelectedLicense = columnsResponse;
    this.fetchDataBasedOnView();
  });
  }


  fetchDataBasedOnView() {
  this.CustomerService.get_data_based_on_view(this.selectedLicense).subscribe((dataResponse) => {
    this.TableData = dataResponse.data;
    const keys = Object.keys(dataResponse.data[0]);
    this.tableHead = keys;
    this.totalEntries = dataResponse.total_records;
    this.total_pages = dataResponse.total_pages
    console.log(this.totalEntries);
    this.calculatePages();
  });
  }


  calculatePages() {
  this.pages = Math.ceil(this.totalEntries / this.selectedlimit);
  this.sendRequest();
}

  setLimitValue(value: any) {
    this.selectedlimit = value;
    this.offset = 0;
    this.calculatePages();
  }

  sendRequest() {
    if (!this.selectedlimit) {
      this.selectedlimit = 10
    }
    const data = {
      'limit': this.selectedlimit,
      'offset': this.offset,
    }

    const url = `${this.API_URL}data/${this.selectedLicense}`;

    this.http.post<any>(url, data).subscribe((Response) => {
    this.TableData = Response.data
    this.onPageChange(this.current_page)
    console.log(Response);
    })
  }


  onPageChange(page: number) {
  this.onFilterModelOpen = false;
  this.current_page = page;
  const offset = (page - 1) * this.selectedlimit;

  const startItem = offset;
  const endItem = startItem + (this.selectedlimit - 1 + 1);

  this.selected = `${endItem}`;
  this.offset = offset;
  this.fetchTableData();
}


  fetchTableData() {
    this.updatePagesArray();
    this.onGenerateReport(false);
}




  updatePagesArray() {
  this.pagesArray = [];
  const currentPage = this.current_page;
  const total_pages = this.total_pages;

  if (total_pages <= 5) {
    for (let i = 1; i <= total_pages; i++) {
      this.pagesArray.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        this.pagesArray.push(i);
      }
      this.pagesArray.push('...');
      this.pagesArray.push(total_pages);
    } else if (currentPage >= total_pages - 2) {
      this.pagesArray.push(1);
      this.pagesArray.push('...');
      for (let i = total_pages - 4; i <= total_pages; i++) {
        this.pagesArray.push(i);
      }
    } else {
      this.pagesArray.push(1);
      this.pagesArray.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        this.pagesArray.push(i);
      }
      this.pagesArray.push('...');
      this.pagesArray.push(total_pages);
    }
    }

  }


  previousPage() {
    if (this.current_page > 1) {
       this.onPageChange(this.current_page - 1);
    }
  }



  nextPage() {
    if(this.current_page < this.total_pages)
      this.onPageChange(this.current_page + 1);
  }



  conditions = [];

  onFilterModel() {
    this.onFilterModelOpen = true;
  }


  onGenerateReport(booleanVal:boolean) {
    this.FirstConditionOnly = booleanVal;
    console.log(this.FirstConditionOnly)
    let condition = {};
    let conditions = [];
    let data = {}
    if (this.onFilterModelOpen) {
      if (!this.onAddFilterFlag) {
       condition = {
      "field": this.firstInput,
      "operator": this.secondInput,
      "value": this.ThirdInput,
      "condition_operator": this.FourthInput,
    }

    if(this.FirstConditionOnly){
        this.conditions.push(condition)
        this.firstInput = ''
        this.secondInput = ''
        this.ThirdInput = ''
        this.FourthInput = ''

        data = {
            "view": this.selectedLicense,
            "fields": this.tableHead,
            "offset": this.offset,
            "limit": this.selectedlimit,
            "conditions": this.conditions
          }
    }else{
        console.log(this.FourthInput)
        condition = {
            "field": this.firstInput,
            "operator": this.secondInput,
            "value": this.ThirdInput,
            "condition_operator": this.FourthInput,
        }
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$")
        this.conditions.push(condition)
        this.firstInput = ''
        this.secondInput = ''
        this.ThirdInput = ''
        this.FourthInput = ''

        data = {
            "view": this.selectedLicense,
            "fields": this.tableHead,
            "offset": this.offset,
            "limit": this.selectedlimit,
            "conditions": this.conditions
          }

    }
    }else {
        condition = {
            "field": this.firstInput,
            "operator": this.secondInput,
            "value": this.ThirdInput,
            "condition_operator": this.FourthInput,
        }
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$")
        this.conditions.push(condition)
        this.firstInput = ''
        this.secondInput = ''
        this.ThirdInput = ''
        this.FourthInput = ''

        data = {
            "view": this.selectedLicense,
            "fields": this.tableHead,
            "offset": this.offset,
            "limit": this.selectedlimit,
            "conditions": this.conditions
          }
    }

}



    console.log(data)
    this.CustomerService.generateReport(data).subscribe((Response) => {
      this.TableData = Response.data
      this.totalEntries = Response.total_records;
      this.total_pages = Response.total_pages;
      this.updatePagesArray();
      const keys = Object.keys(Response.data[0]);
    },(Error)=>{
    this.noDataFound = true
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['firstInput'] || changes['secondInput'] || changes['ThirdInput'] || changes['FourthInput']) {
    console.log('res', changes);

    }
  }

  clearFilter(){
    this.conditions = []
    this.noDataFound = false;
    this.firstInput = ''
    this.secondInput = ''
    this.ThirdInput = ''
    this.FourthInput = ''
    this.fetchDataBasedOnView();
  }

  addCondition(booleanValue:boolean) {
    this.FirstConditionOnly = booleanValue;
    this.onAddFilterFlag = true;

    if(this.FirstConditionOnly === false){
        const condition = {
            "field": this.firstInput,
            "operator": this.secondInput,
            "value": this.ThirdInput,
            "condition_operator": this.FourthInput,
          }

          this.conditions.push(condition)
          this.firstInput = ''
          this.secondInput = ''
          this.ThirdInput = ''
          this.FourthInput = ''
    }

  }

  remove(index) {
    this.conditions.splice(index, 1)
  }

  filterCategory(): any[] {
    if (!this.searchTerm) {
    return this.TableData;
    }
    const searchTerm = this.searchTerm.toLowerCase();
    return this.TableData.filter(item => item.name.toLowerCase().includes(searchTerm));
  }

  exportToExcel(): void {
    this.SaveExcel(this.TableData, 'report.xlsx');
    console.log('Total records:', this.TableData.length);
  }


  public SaveExcel(data: any[], fileName: string): void {
    const headers = this.tableHead;

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    // Add headers to the Excel sheet
    for (let i = 0; i < headers.length; i++) {
      const header = typeof headers[i] === 'object' ? headers[i].text : String(headers[i]);
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: i });
      worksheet[cellAddress] = { v: header, t: 's' };
    }

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  handleRenderPdf(data:any) {
    this.pdfObject = PDFObject.embed('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '#pdfContainer');
 }

}

