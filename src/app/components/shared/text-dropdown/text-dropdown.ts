import { Component, ElementRef, SimpleChanges, ViewChild, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-text-dropdown',
  imports: [FormsModule],
  templateUrl: './text-dropdown.html',
  styleUrl: './text-dropdown.css'
})
export class TextDropdown {
  @ViewChild('textDDL') textDDL_elm!: ElementRef;

  value = model<string | null>();
  use_col = input<any>("name");
  placeholder = input<string>("");
  text: any = null;



  // Input data for the select DDL
  InputData = input<any[]>([]);
  filteredData: any[] = [];


  // getFilterData() {
  //   let opt:any[] =[];
  //   this.InputData().forEach((d)=>{
  //     opt.push(d[this.use_col()]);
  //   });
  // }

  ngOnInit() {
    if (this.value() != null)
      this.text = this.value();
   
    this.filteredData = this.InputData();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['InputData'])
      this.textOnKeyUp();

    if (changes['text_value'])
      this.text = this.value();
  }



  openDDL() {
    if (this.filteredData.length > 0)
      this.textDDL_elm.nativeElement.classList.add('open');
    else
      this.textDDL_elm.nativeElement.classList.remove('open');
  }


  selectOption(opt: string) {
    this.text = opt;
    console.log(opt)
    this.textOnKeyUp();
    this.textDDL_elm.nativeElement.classList.remove('open');
  }

  textOnKeyUp() {

     console.log("Input Data");
    console.log(this.InputData());

    if (this.text == "" || this.text == null) {
      this.filteredData = this.InputData();
      return;
    }

    this.filteredData = this.InputData().filter((item: any) => {
      return item[this.use_col()].toLowerCase().includes(this.text?.toLowerCase());
    });

    this.value.update(() => this.text);

    this.openDDL();


  }


}
