import { Component, computed, ElementRef, input, model, output, SimpleChanges, ViewChild } from '@angular/core';

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

  value = model<any>([]);
  // Input data for the select DDL
  inputData = input<any>([]);
  // COLUMN names for text and value
  use_col_text = input<string>("");
  use_col_value = input<string>("");

  // Input for already selected values
  selected_values: any[] = [];

  // Copy of Input data used to filter the DDL
  filteredData: any[] = [];

  // Event Emitter on selection
  // onSelectChange = output<any[]>();
  // Error Message

  //return variable for the selection values
  // outputData: any[] = [];


  // Update the filtered list when selected values change
  OnSelectedChange() {
    if (this.value() != null && this.value().length > 0 && this.inputData().length > 0) {
      let opt = this.value();
      for (let i in opt) {
        {
          let optVal = this.inputData().filter((item: any) => item[this.use_col_value()] == opt[i]);
          if (optVal.length > 0) {
            this.selected_values.push({ text: optVal[0][this.use_col_text()], value: optVal[0][this.use_col_value()] });
          }
        }
      }
    }
    else
      this.selected_values = [];

    console.log("selected_values", this.selected_values);

    this.refreshFilteredData();
  }

  refreshFilteredData() {
    this.filteredData = this.inputData().filter((item: any) => !this.selected_values.find(opt => opt.value === item[this.use_col_value()]));
  }

  // set the value of the copy variables on init
  ngOnInit() {

    this.OnSelectedChange();
    // console.log("error Class");
    // console.log(this.errorClass());
    // // if pre selected vales are available set it to the output variable
    // if (this.selected())
    //   this.outputData = this.selected();
    // else
    //   this.outputData = [];
    // // set the value of the filter variable. We exclude the values which are already present in the outputData
    // this.filteredData = this.selectInputData().filter((item: any) => !this.outputData.includes(item.value));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputData'] || changes['selected']) {
      this.OnSelectedChange();
    }
  }

  removeSelectOption(index: number) {
    this.selected_values.splice(index, 1);
    this.refreshFilteredData();
    this.emitChange();
  }

  searchData(searchText: string) {
    console.log(searchText);
    // If SeRCH Test is blank return the default filter value
    if (!searchText || searchText == "" || searchText == null) {
      this.refreshFilteredData();
      return;
    }

    // if not filter the default filter values
    let d = this.inputData().filter((item: any) => !this.selected_values.find(opt => opt.value === item[this.use_col_value()]));
    this.filteredData = d.filter((item: any) => {
      return item[this.use_col_text()].toLowerCase().includes(searchText.toLowerCase());
    });
  }

  selectOption(opt: any) {
    this.selected_values.push({ text: opt[this.use_col_text()], value: opt[this.use_col_value()] });
    this.refreshFilteredData();
    this.emitChange();
  }




  emitChange() {
    let opts: any[] = [];
    for (let i in this.selected_values) {
      opts.push(this.selected_values[i].value);
    }

    this.value.update(() => opts);
  }

}

