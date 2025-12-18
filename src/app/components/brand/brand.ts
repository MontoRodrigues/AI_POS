import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { dataBrand, DataService } from '../../services/data-service';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import { defaultConfig } from '../../config/config';

declare var showLoader: Function;
declare var notify: Function;

@Component({
  selector: 'app-brand',
  imports: [Breadcrumb, FormsModule],
  templateUrl: './brand.html',
  styleUrl: './brand.css'
})
export class Brand {


  private subscribe_brand: Subscription | undefined;
  brandList: dataBrand[] = [];

  newBrand: string = "";
  validate_newBrand = "mb-3";


  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit() {
    showLoader(false);
    this.subscribe_brand = this.dataService.brand$.subscribe({
      next: (value: dataBrand[]) => {
        console.log("brand", value);
        this.brandList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }

  async addBrand() {

    let isValid = true;

    if (!this.newBrand || this.newBrand.trim() === "") {
      this.validate_newBrand = "mb-3 error-field";
      isValid = false;
      notify( "error","Please enter the brand name");
    } else {
      this.validate_newBrand = "mb-3";
    }


    let existingBrand = this.brandList.find(b => b.name.toLowerCase() === this.newBrand.trim().toLowerCase());
    if(existingBrand == undefined){
      this.validate_newBrand = "mb-3";
    }
    else{
      notify( "error","Brand name already exists");
      this.validate_newBrand = "mb-3 error-field";
      isValid = false;
    }



    if (isValid) {
      showLoader(true);
      await this.firebaseService.addDocument(defaultConfig.collections.brand.name, { "name": this.newBrand.trim() });
      notify("success","Brand added successfully");
      this.newBrand = "";
      showLoader(false);
      this.cdRef.detectChanges();
    }


  }

  editBrandClick(brand: dataBrand) {
    brand.edit_name = brand.name;
    brand.edit = true;
  }

  cancelEditBrand(brand: dataBrand) {
    brand.edit = false;
    brand.edit_name = null;
  }

  async deleteBrand(brand: dataBrand) {

    let c = confirm(`Do you want to Delete the Brand ${brand.name}?`)
    if (c) {
      await this.firebaseService.deleteDocument(defaultConfig.collections.brand.name + "/" + brand.docId);
      showLoader(true);
      notify("success", `Brand ${brand.name} deleted successfully`);
      showLoader(false);
    }
  }

  async updateBrand(brand: dataBrand) { 
    let isValid = true;
    if (brand.name==null || brand.name.trim() === "") {
      isValid = false;
      notify("error","Please fill all required fields");
      return;
    }
 
    if (isValid) {
      showLoader(true);
      await this.firebaseService.updateDocument(defaultConfig.collections.brand.name + "/" + brand.docId, { "name": brand.name.trim() });

      brand.edit = false;
      brand.edit_name = null;
      this.cdRef.detectChanges();
      notify("success", `Brand ${brand.name} updated successfully`);

      showLoader(false);

    }


  }

}