import { Component, ElementRef, SimpleChanges, ViewChild, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-text-dropdown',
  imports: [FormsModule],
  templateUrl: './text-dropdown.html',
  styleUrl: './text-dropdown.css'
})
export class TextDropdown {
  text_value = model<string | null>();
  @ViewChild('textDDL') textDDL_elm!: ElementRef;
  text: any = null;
  placeholder = input<string>("");

  // Input data for the select DDL
  InputData = input<any[]>([]);
  filteredData: any[] = [];
  ngOnInit() {
    this.filteredData = this.InputData();
    console.log(this.filteredData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['InputData'])
      this.textOnKeyUp();

    if (changes['text_value'])
      this.text = this.text_value();
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

    if (this.text == "" || this.text == null) {
      this.filteredData = this.InputData();
      return;
    }

    this.filteredData = this.InputData().filter((item: any) => {
      return item?.toLowerCase().includes(this.text?.toLowerCase());
    });


    this.text_value.update(() => this.text);

    this.openDDL();

    console.log(this.filteredData);

  }


}
