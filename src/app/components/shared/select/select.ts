import { Component, ElementRef, input, model, output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type inputData = {
  value: any;
  text: string;
};

@Component({
  selector: 'app-select',
  imports: [FormsModule],
  templateUrl: './select.html',
  styleUrl: './select.css'
})
export class Select {
  @ViewChild('filter') filter_txt!: ElementRef;
  @ViewChild('multiselect') multiselect_div!: ElementRef;

  value = model<string | null>();
  use_col_text = input<string>("");
  use_col_value = input<string>("");

  // Input data for the select DDL
  inputData = input<any>([]);

  // Copy of Input data used to filter the DDL
  filteredData: any[] = [];


  // Input for already selected values
  select_value: string | null | undefined = null;

  // filter model
  filter_value: string = "";


  constructor() {


  }

  ngOnInit() {
    this.filteredData = this.inputData();
    this.updateSelectValue();
  }

  updateSelectValue() {
    if (this.value() != null && this.value() != "" && this.inputData().length > 0) {
      let d = this.inputData().filter((item: any) => {  return item[this.use_col_value()] == this.value() });
      if (d.length > 0)
        this.select_value = d[0][this.use_col_text()];
      else
        this.select_value = null;
    }
    else {
      this.select_value = null;
    }
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputData']) {
      if (this.inputData() && this.inputData().length)
        this.filteredData = this.inputData();
      this.updateSelectValue();
    }

    if (changes['value'])
      this.updateSelectValue();
  }

  filterList() {
    if (this.filter_value == "" || this.filter_value == null) {
      this.filteredData = this.inputData();
      return;
    }

    this.filteredData = this.inputData().filter((item: any) => {
      return item[this.use_col_text()]?.toLowerCase().includes(this.filter_value.toLowerCase());
    });
  }

  selectOption(opt: any) {
    // set selected value 
    this.select_value = opt[this.use_col_text()]

    console.log(opt[this.use_col_value()]);
    // update Value Model
    this.value.update(() => opt[this.use_col_value()]);

    // close multi select 
    this.multiselect_div.nativeElement.classList.remove('open');
    // clear search value
    this.filter_value ="";
    // filter the list to default 
    this.filterList();
  }
}
