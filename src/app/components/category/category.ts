import { ChangeDetectorRef, Component, computed, ViewChild } from '@angular/core';
import { Icategory } from '../../interface/icategory';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { where, orderBy, limit } from 'firebase/firestore';
import { ImageControl } from '../shared/delete_this/image-control/image-control';
import { Select } from '../shared/select/select';
import { defaultConfig } from '../../config/config';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';
import { dataCategory, DataService } from '../../services/data-service';


const conf = defaultConfig;


declare var toggle_left_slide_model: Function;
declare var toggle_loader: Function;

declare var showLoader: Function;
declare var notify: Function;

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, ImageControl, Select, Breadcrumb], //, Select],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {

  @ViewChild(ImageControl) imgControlRef!: ImageControl;


  parent_category_doc_id = null;

  // new category variable
  new_category: Icategory = {
    id: null,
    name: null,
    slug: null,
    parentDocID: null,
    ancestors: [],
    level: null,
    path: [],
    catImage: null
  }

  // validate new category variable
  new_category_validate = {
    name: "mb-3",
    parentId: "mb-3",
    imageUrl: "mb-3"
  }

  // collection to subscribe
  CollectionName: string = "category"

  // subscribe to Category List 
  private subscribe_category: any;
  // existing category list 
  //category_list: any[] = [];
  category_list: dataCategory[] = [];
  category_list_ddl: any[] = [];

  // category_ddl: any = {};
  // parent Doc ID
  // parent_doc_id: string | null = "root";
  // Category Image Blob received from image controller
  image_blob: Blob | undefined = undefined;


  // Event from Image Controller once image is selected and resized
  onImageUpload(e: any) {
    console.log("Blob");
    console.log(e);
    console.log(e.type);
    this.image_blob = e;

  }



  private validate(): boolean {
    let v: boolean = true;
    // Category Name
    if (this.new_category.name == null) {
      v = false;
      this.new_category_validate.name = "mb-3 error";
    }
    else {
      this.new_category_validate.name = "mb-3";
    }


    console.log(this.parent_category_doc_id);
    // // Category parentId

    if (this.parent_category_doc_id == null) {
      this.new_category_validate.parentId = "mb-3 error";
    }
    else {
      this.new_category_validate.parentId = "mb-3";
    }

    // Category Image
    if (this.image_blob == undefined) {
      this.new_category_validate.imageUrl = "mb-3 error";
    }
    else {
      this.new_category_validate.imageUrl = "mb-3";
    }

    return v;
  }

  async addCategory() {
    if (this.validate()) {
      showLoader(true);

      // Create New ID
      this.new_category.id = self.crypto.randomUUID();

      // Add Slug as lower case Name and replacing all spaces with _
      if (this.new_category.name != undefined)
        this.new_category.slug = this.new_category.name?.toLocaleLowerCase().replaceAll(" ", "_");

      console.log("parent category id", this.parent_category_doc_id);
      // check if Parent Doc ID is null or root. then set the variables to default root Level
      if (this.parent_category_doc_id == null || this.parent_category_doc_id == "root") {
        this.new_category.level = "root";
        this.new_category.path?.push(this.new_category.name);
        this.new_category.parentDocID = null;
        this.new_category.ancestors = [];
      }
      else {
        let path: any[] = [];
        path.push(this.new_category.name);

        let doc_id: string | null = this.parent_category_doc_id;
        let level = 0;
        let ancestors: any[] = [];
        ancestors.push(doc_id);

        while (doc_id != null) {
          console.log("Repeating");
          let doc = this.category_list.find(item => item.docId == doc_id);
          console.log(doc);
          if (doc == undefined)
            break;

          doc_id = doc.parentDocID;

          if (doc_id != null)
            ancestors.unshift(doc_id);

          path.unshift(doc.name);

          level++;
          if (level > 20)
            doc_id = null;
        }

        this.new_category.parentDocID = this.parent_category_doc_id;

        this.new_category.level = "level " + level;
        this.new_category.path = path;
        this.new_category.ancestors = ancestors;
      }


      //check if uploaded Image is undefined then set the default category image else upload the image 
      if (this.image_blob == undefined) {
        this.new_category.catImage = conf.default_images.category;
      }
      else {
        // Upholding Image and getting the URL
        let image_url = null;
        let imagePath = "category/" + this.new_category.id + ".png";
        if (this.image_blob != undefined)
          image_url = await this.firebaseService.uploadImage(this.image_blob, imagePath);
        this.new_category.catImage = {
          downloadURL: image_url,
          fileName: this.new_category.id + ".png",
          folder: "category/"
        };
      }

      console.log("New Category");
      console.log(this.new_category);

      // // upload doc to firebase
      await this.firebaseService.addDocument(this.CollectionName, this.new_category);

      // reset form 
      // reset image controller
      this.imgControlRef.resetState();

      //reset new category variable
      this.new_category = {
        id: null,
        name: null,
        slug: null,
        parentDocID: null,
        ancestors: [],
        level: null,
        path: null,
        catImage: null
      }

      // reset validate new category variable
      this.new_category_validate = {
        name: "mb-3",
        parentId: "mb-3",
        imageUrl: "mb-3"
      }

      //     // clear Parent ID
      this.parent_category_doc_id = null;
      //     // clear image blob
      this.image_blob = undefined;
      this.cdRef.detectChanges();


      showLoader(false);




    }
  }


  async deleteCategory(doc_id: string) {

    let c = confirm(`Do you want to Delete the Category and all its sub-categories?`)
    if (c) {
      showLoader(true);
      //delete all sub-categories
      const sub_categories = this.category_list.filter(cat => cat.ancestors.includes(doc_id));
      for (let sub_cat of sub_categories) {
        await this.firebaseService.deleteDocument(defaultConfig.collections.category.name + "/" + sub_cat.docId);
      }
      //delete the selected category
      await this.firebaseService.deleteDocument(defaultConfig.collections.category.name + "/" + doc_id);
      this.cdRef.detectChanges();
      showLoader(false);
    }


  }

  editCategory(c: dataCategory) {
    c.edit = true;
    c.editName = c.name;
    c.editParentDocID = c.parentDocID;
  }

  cancelCategory(c: dataCategory) {
    c.edit = false;
    c.name = c.editName ?? c.name;
    c.parentDocID = c.editParentDocID ?? null;
  }

  getUpdateData(c: dataCategory) {
    let data: any = [];

    data.push({
      docId: "root",
      pathString: "root"
    });

    for (let cat in this.category_list) {
      if (!this.category_list[cat].ancestors.includes(c.docId) && this.category_list[cat].docId != c.docId) {
        data.push({
          docId: this.category_list[cat].docId,
          pathString: this.category_list[cat].path.join("/")
        });
      }
    }

    return data;

  }

  getParentCategory(c: dataCategory) {

    if (c.parentDocID == null || c.parentDocID == "root") {
      c.level = "root";
      c.path = [];
      c.path?.push(c.name);
      c.parentDocID = null;
      c.ancestors = [];
    }
    else {
      let path: any[] = [];
      path.push(c.name);

      let doc_id: string | null = c.parentDocID;
      let level = 0;
      let ancestors: any[] = [];
      ancestors.push(doc_id);

      while (doc_id != null) {
        console.log("Repeating");
        let doc = this.category_list.find(item => item.docId == doc_id);
        console.log(doc);
        if (doc == undefined)
          break;

        doc_id = doc.parentDocID;

        if (doc_id != null)
          ancestors.unshift(doc_id);

        path.unshift(doc.name);

        level++;
        if (level > 20)
          doc_id = null;
      }

      c.level = "level " + level;
      c.path = path;
      c.ancestors = ancestors;
    }
  }
  updateCategory = async (c: dataCategory) => {

    // this.getParentCategory(c);
    // console.log(c);
    //validate
    let val = true;
    const sub_categories = this.category_list.filter(cat => cat.ancestors.includes(c.docId));

    if (c.parentDocID == c.docId) {
      val = false;
      notify("error", "A category cannot be its own parent category.", 1500);
    }
    else if (c.name == null || c.name.trim() == "") {
      val = false;
      notify("error", "Category name cannot be empty.", 1500);
    }
    else if (sub_categories.length > 0) {
      val = confirm("Changing parent category will also change parent for all its sub-categories. Do you want to proceed?");
    }
    else {
      val = confirm("Do you want to update the category?");
    }

    if (val) {
      showLoader(true);
      // update parent category for Selected Category
      this.getParentCategory(c);
      await this.firebaseService.updateDocument(defaultConfig.collections.category.name + "/" + c.docId, c);

      if (sub_categories.length > 0) {
        // update parent category for all its sub-categories
        for (let sub_cat of sub_categories) {
          this.getParentCategory(sub_cat);
          await this.firebaseService.updateDocument(defaultConfig.collections.category.name + "/" + sub_cat.docId, sub_cat);
        }
      }

      c.edit = false;
      this.cdRef.detectChanges();
      showLoader(false);
    }


  }

  categoryDDLList: any[] = [];


  navigateTo(path: string) {
    this.router.navigate([path]);
  }


  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit() {
    showLoader(false);
    //subscribe Category collection     
    this.subscribe_category = this.dataService.category$.subscribe({
      next: (value: dataCategory[]) => {
        console.log("category", value);
        value = value.sort((a, b) => {
          if (a.path.join('/') < b.path.join('/')) return -1;
          if (a.path.join('/') > b.path.join('/')) return 1;
          return 0;
        });
        this.category_list = value;
        this.category_list_ddl = [];
        this.category_list_ddl.push({
          docId: "root",
          pathString: "root"
        });

        for (let cat in this.category_list) {
          this.category_list_ddl.push({
            docId: this.category_list[cat].docId,
            pathString: this.category_list[cat].path.join("/")
          });
        }


        this.cdRef.detectChanges();
      },
      error: (e: any) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  ngOnDestroy() {
    if (this.subscribe_category) {
      this.subscribe_category.unsubscribe();
    }
  }

}
