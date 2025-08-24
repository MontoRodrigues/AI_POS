import { Component, model, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-add-tags',
  imports: [FormsModule],
  templateUrl: './text-add-tags.html',
  styleUrl: './text-add-tags.css'
})
export class TextAddTags {
  tags = model<string[]>([]);
  text: any = null;
  tag_list: string[] = [];

  ngOnInit() {
    this.tag_list = this.tags();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tags'])
      this.tag_list = this.tags();
  }

  addTag() {
    if (this.text != null || this.text != "") {
      this.tag_list.push(this.text);
      this.text = null;
      this.tags.update(() => this.tag_list);
    }
  }

  remove(index:number){
    this.tag_list.splice(index,1);
    this.tags.update(() => this.tag_list);
  }

}
