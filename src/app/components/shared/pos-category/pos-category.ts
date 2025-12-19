import { Component, computed, input, model, SimpleChanges } from '@angular/core';
import { CategoryPath, categoryStore } from '../../../interface/ipos';

@Component({
  selector: 'app-pos-category',
  imports: [],
  templateUrl: './pos-category.html',
  styleUrl: './pos-category.css'
})
export class PosCategory {
  // Model for the selected Category signal
  value = model<string>('all');
  // category list signal 
  category = input<categoryStore[]>([]);

  filterCategory = computed((): categoryStore[] => {
    if (this.value() === 'all') {
      let c: categoryStore[] = [];
      for (let cat of this.category()) {
        if (cat.level === "root")
          c.push(cat);
      }
      return c;
    }
    else {
      return this.category().filter((cat) => {
        if (cat.ancestors.length > 0) {
          return cat.ancestors[cat.ancestors.length - 1] === this.value();
        }
        else
          return false;
      });

    }
  });

  selectedCategory = computed((): categoryStore | null => {
    let doc: categoryStore[] = this.category().filter((cat) => cat.docId == this.value());
    console.log("selected Category", doc);
    if (doc.length > 0)
      return doc[0];
    else
      return null;
  });

  selectedCategoryPath = computed((): CategoryPath[] => {
    let p: CategoryPath[] = [];
    let doc: categoryStore[] = this.category().filter((cat) => cat.docId == this.value());
    console.log("path doc", doc);
    if (doc.length > 0) {
      // TODO: populate p with category path
      for (let catDocId of doc[0].ancestors) {
        let ans_cat: categoryStore[] = this.category().filter((cat) => cat.docId == catDocId);
        if (ans_cat.length > 0)
          p.push({ "name": ans_cat[0].name, "docId": catDocId, selectable: true });
      }
      p.push({ "name": doc[0].name, "docId": this.value(), selectable: false });
    }
    console.log("path", p);
    return p;
  });

  getCategoryName(docId: string) {
    let doc: categoryStore[] = this.category().filter((cat) => cat.docId == docId);
    if (doc.length > 0)
      return doc[0].name;
    else
      return null;
  }




}
