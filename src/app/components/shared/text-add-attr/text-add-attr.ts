import { Component, input, model, SimpleChanges } from '@angular/core';
import { attr } from '../../../interface/iproduct';
import { FormsModule } from '@angular/forms';
import { TextDropdown } from '../text-dropdown/text-dropdown';

@Component({
  selector: 'app-text-add-attr',
  imports: [FormsModule, TextDropdown],
  templateUrl: './text-add-attr.html',
  styleUrl: './text-add-attr.css'
})

export class TextAddAttr {
  attributes = model<attr[]>([]);
  attributes_list: any[] = [];

  attr_master = input<any[]>([]);


  text_attr: any = null;
  text_value: any = null;


  ngOnInit() {
    this.attributes_list = this.attributes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['attributes'])
      this.attributes_list = this.attributes();
  }


  add_attr() {
    console.log(this.text_attr);
    console.log(this.text_value);
    if ((this.text_attr != null || this.text_attr != "") && (this.text_value != null || this.text_value != "")) {
      this.attributes_list.push({ type: this.text_attr, value: this.text_value });
      this.text_attr = null;
      this.text_value = null;
      this.attributes.update(() => this.attributes_list);
      
    }
  }

  remove_attr(index: number) {
    this.attributes_list.splice(index, 1);
    this.attributes.update(() => this.attributes_list);

  }
}
