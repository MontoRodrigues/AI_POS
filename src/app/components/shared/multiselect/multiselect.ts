import { Component, computed, ElementRef, input, output, ViewChild } from '@angular/core';

export type inputData = {
  value: any;
  text: string;
};


@Component({
  selector: 'app-multiselect',
  imports: [],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.css'
})

export class Multiselect {
  @ViewChild('filter') ddlFilter!: ElementRef;

  // Event Emitter on selection
  onSelectChange = output<any[]>();

  // Error Message
  errorMessage = input<string>();

  // Input data for the select DDL
  selectInputData = input<any>();
  // Copy of Input data used to filter the DDL
  filteredData: any[] = [];
  // Input for already selected values
  selected = input<any>();
  //return variable for the selection values
  outputData: any[] = [];

  // class for error
  errorClass = input<boolean>();

  // set the value of the copy variables on init
  ngOnInit() {
    console.log("error Class");
    console.log(this.errorClass());
    // if pre selected vales are available set it to the output variable
    if (this.selected())
      this.outputData = this.selected();
    else
      this.outputData = [];
    // set the value of the filter variable. We exclude the values which are already present in the outputData
    this.filteredData = this.selectInputData().filter((item: any) => !this.outputData.includes(item.value));
  }



  selectOption(opt:inputData){
    this.outputData.push(opt.value);
    this.emitChange();
    this.filteredData = this.filteredData = this.selectInputData().filter((item: any) => !this.outputData.includes(item.value));
    this.searchData(this.ddlFilter.nativeElement.value);
  }

  removeSelectOption(index:number){
    console.log(index)
    this.outputData.splice(index,1);
    this.emitChange();
    this.filteredData = this.filteredData = this.selectInputData().filter((item: any) => !this.outputData.includes(item.value));
    this.searchData(this.ddlFilter.nativeElement.value);
  }

  // text box to filter and search the values in the DDL
  searchData(searchText: string) {
    console.log(searchText);
    // If SeRCH Test is blank return the default filter value
    if (!searchText || searchText == "" || searchText == null) {
      this.filteredData = this.filteredData = this.selectInputData().filter((item: any) => !this.outputData.includes(item.value));
      return;
    }

    // if not filter the default filter values
    let d = this.selectInputData().filter((item: any) => !this.outputData.includes(item.value))
    this.filteredData = d.filter((item: any) => {
      return item?.text.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  emitChange(){
    this.onSelectChange.emit(this.outputData);
  }

}

