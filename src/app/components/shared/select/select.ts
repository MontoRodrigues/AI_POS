import { Component, ElementRef, input, output, SimpleChanges, ViewChild } from '@angular/core';

export type inputData = {
  value: any;
  text: string;
};

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css'
})
export class Select {
  @ViewChild('filter') ddlFilter!: ElementRef;
  @ViewChild('multiselect') multiselect_div!: ElementRef;

  // Event Emitter on selection
  onSelectChange = output<string>();

  // Error Message
  errorMessage = input<string>();

  // Input data for the select DDL
  selectInputData = input<any>();
  // Copy of Input data used to filter the DDL
  filteredData: any[] = [];
  // Input for already selected values
  selected = input<string | null>();
  //return variable for the selection values
  outputData: any = undefined;

  // class for error
  errorClass = input<boolean>();

  constructor() {


  }

  ngOnInit() {
    this.filteredData = this.selectInputData();
    if (this.selected() != undefined && this.selected != null) {
      let opt = this.selectInputData().filter((item: any) => {
        return item?.value == this.selected();
      });
      if (opt.length > 0)
        this.outputData = opt[0];

      console.log(this.outputData)
    }
    console.log(this.selected());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectInputData'])
      this.filteredData = this.selectInputData();

    if (changes['selected']) {
      if (this.selected() == null)
        this.outputData = undefined;
      else {
        let opt = this.selectInputData().filter((item: any) => {
          return item?.value == this.selected();
        });
        if (opt.length > 0)
          this.outputData = opt[0];
      }
    }



  }

  searchData(searchText: string) {
    console.log(searchText);
    if (!searchText || searchText == "" || searchText == null) {
      this.filteredData = this.selectInputData();
      return;
    }


    this.filteredData = this.selectInputData().filter((item: any) => {
      return item?.text.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  selectOption(opt: any) {
    this.multiselect_div.nativeElement.classList.toggle('open')
    this.outputData = opt;
    this.onSelectChange.emit(this.outputData);
  }
}
