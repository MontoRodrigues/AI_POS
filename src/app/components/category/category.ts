import { ChangeDetectorRef, Component, computed, ViewChild } from '@angular/core';
import { Icategory } from '../../interface/icategory';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { where, orderBy, limit } from 'firebase/firestore';
import { ImageControl } from '../shared/delete_this/image-control/image-control';
import { Select } from '../shared/select/select';
import { AppDefaultConfig } from '../../config/config';


const conf = new AppDefaultConfig();


declare var toggle_left_slide_model: Function;
declare var toggle_loader: Function;

@Component({
  selector: 'app-category',
  imports: [CommonModule, FormsModule, ImageControl], //, Select],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {

  @ViewChild(ImageControl) imgControlRef!: ImageControl;

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
    parentId: false,
    imageUrl: "mb-3"
  }
  
  // collection to subscribe
  CollectionName: string = "category"

  // subscribe to Category List 
  private subscribe_category: any;
  // existing category list 
  category_list: any[] = [];


  // category_ddl: any = {};
  // parent Doc ID
  parent_doc_id: string | null = "root";
  // Category Image Blob received from image controller
  image_blob: Blob | undefined = undefined;


  // Event from Image Controller once image is selected and resized
  onImageUpload(e: any) {
    console.log("Blob");
    console.log(e);
    console.log(e.type);
    this.image_blob = e;

  }

  // event from Select controller once a Category is selected 
  getParentProductCategory(d: any) {
    console.log("DDL Change");
    console.log(d);
    this.parent_doc_id = d.value;
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

    // Category parentId
    if (this.parent_doc_id == null) {
      this.new_category_validate.parentId = true;
    }
    else {
      this.new_category_validate.parentId = false;
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

  categoryDDLList: any[] = [];

  async addCategory() {
    console.log("Category Values");
    console.log(this.new_category);
    console.log(this.new_category_validate);
    console.log("")
    if (this.validate()) {

      toggle_loader("Please wait while we add the category");

      let image_url = null;

      // Create New ID
      this.new_category.id = self.crypto.randomUUID();

      // Add Slug as lower case Name and replacing all spaces with _
      if (this.new_category.name != undefined)
        this.new_category.slug = this.new_category.name?.toLocaleLowerCase().replaceAll(" ", "_");



      // check if Parent Doc ID is null or root. then set the variables to default root Level
      if (this.parent_doc_id == null || this.parent_doc_id == "root") {
        this.new_category.level = "root";
        this.new_category.path?.push(this.new_category.name);

        // this.new_category.ancestors
        // this.new_category.parentDocID
        // this.new_category.parentId
      }
      else {
        let path: any[]=[];
         path.push(this.new_category.name);

        let doc_id: string | null = this.parent_doc_id;
        let level = 0;
        let ancestors: any[] = [];
        ancestors.push(doc_id);

        while (doc_id != null) {
          console.log("Repeating");
          let doc = this.category_list.find(item => item.docId == doc_id);
          console.log(doc);
          doc_id = doc.data.parentDocID;
          path.unshift(doc.data.name);
          // path = doc.data.name + "/" + path;
          if (doc_id != null)
            ancestors.unshift(doc_id);

          level++;
          if (level > 20)
            doc_id = null;
        }

        console.log({ "level": level, path: path, ancestors: ancestors });

        this.new_category.parentDocID = this.parent_doc_id;

        this.new_category.level = "level " + level;
        this.new_category.path = path;
        this.new_category.ancestors = ancestors;
      }

      // check if uploaded Image is undefined then set the default category image else upload the image 
      if (this.image_blob == undefined) {
        this.new_category.catImage = conf.default_images.category;
      }
      else {
        // Upholding Image and getting the URL
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

      // upload doc to firebase
      this.firebaseService.addDocument(this.CollectionName, this.new_category).then();

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
        parentId: false,
        imageUrl: "mb-3"
      }

      // clear Parent ID
      this.parent_doc_id = null;
      // clear image blob
      this.image_blob = undefined;
      this.cdRef.detectChanges();
      toggle_left_slide_model();
      toggle_loader("Please wait while we add the category");

    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }


  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    const constrain: any[] = [
      orderBy('path')
    ];
    this.subscribe_category = this.firebaseService.subscribeToCollection(this.CollectionName, (snapshot) => {
      this.category_list = [];
      let p: any = []

      snapshot.forEach(doc => {
        p.push({ docId: doc.id, data: doc.data() });
      });

      this.category_list = p;
      let cddl = this.category_list.map((item: any) => { return { "value": item.docId, "text": item.data.path.join('/') } });
      cddl.unshift({ "value": "root", "text": "Root" });
      this.categoryDDLList = cddl;

      this.cdRef.detectChanges();
      console.log(this.category_list);
    }, constrain);
  }

  ngOnDestroy() {
    if (this.subscribe_category) {
      this.subscribe_category();
    }
  }

}
