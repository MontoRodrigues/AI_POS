import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService, dataUOM } from '../../services/data-service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { Breadcrumb } from '../shared/breadcrumb/breadcrumb';
import { TextDropdown } from '../shared/text-dropdown/text-dropdown';
import { FormsModule } from '@angular/forms';
import { defaultConfig } from '../../config/config';

declare var showLoader: Function;
declare var notify: Function;

export interface newUOM {
  type: string | null;
  abbr: string | null;
  measure: string | null;
}

@Component({
  selector: 'app-uom',
  imports: [Breadcrumb, TextDropdown, FormsModule],
  templateUrl: './uom.html',
  styleUrl: './uom.css'
})
export class Uom {


  private subscribe_uom: Subscription | undefined;
  uomList: dataUOM[] = [];

  uomTypes: any[] = []


  new_uom: newUOM = {
    type: "",
    abbr: "",
    measure: ""
  }

  validate_newUOM = {
    type: "mb-3",
    abbr: "mb-3",
    measure: "mb-3"
  }


  constructor(private cdRef: ChangeDetectorRef, private router: Router, private firebaseService: FirebaseService, private dataService: DataService) { }

  ngOnInit() {
    this.subscribe_uom = this.dataService.uom$.subscribe({
      next: (value: dataUOM[]) => {
        console.log("UOM", value);

        let _typeObj: any = {};
        this.uomTypes = [];
        if (value.length > 0) {
          for (let uom of value) {
            if (!_typeObj[uom.type]) {
              _typeObj[uom.type] = true;
              this.uomTypes.push({ "type": uom.type });
            }
          }

        }

        this.uomList = value;
        this.cdRef.detectChanges();
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

    showLoader(false);
  }

  ngOnDestroy() {
    if (this.subscribe_uom) {
      this.subscribe_uom.unsubscribe();
    }
  }

  validateNewUOM(): boolean {
    let isValid = true;

    // Type
    if (this.new_uom.type == null || this.new_uom.type == "") {
      isValid = false;
      this.validate_newUOM.type = "mb-3 error";
    }
    else {
      this.validate_newUOM.type = "mb-3";
    }


    // abbr
    if (this.new_uom.abbr == null || this.new_uom.abbr == "") {
      isValid = false;
      this.validate_newUOM.abbr = "mb-3 error";
    }
    else {
      this.validate_newUOM.abbr = "mb-3";
    }

    // measure
    if (this.new_uom.measure == null || this.new_uom.measure == "") {
      isValid = false;
      this.validate_newUOM.measure = "mb-3 error";
    }
    else {
      this.validate_newUOM.measure = "mb-3";
    }



    return isValid;

  }

  async addUOM() {

    console.log(this.new_uom);

    if (this.validateNewUOM()) {
      showLoader(true);

      await this.firebaseService.addDocument(defaultConfig.collections.uom.name, this.new_uom);


      this.new_uom = {
        type: "",
        abbr: "",
        measure: ""
      }

      this.validate_newUOM = {
        type: "mb-3",
        abbr: "mb-3",
        measure: "mb-3"
      }

      this.cdRef.detectChanges();
      notify("success", "Supplier added successfully");
      showLoader(false);
    }

  }

  editUOMClick(uom: dataUOM) {
    uom.edit = true;
    uom.edit_abbr = uom.abbr;
    uom.edit_measure = uom.measure;
    uom.edit_type = uom.type;
    this.cdRef.detectChanges();
  }

  cancelEditUOM(uom: dataUOM) {
    uom.edit = false;
    uom.abbr = uom.edit_abbr ?? uom.abbr;
    uom.measure = uom.edit_measure ?? uom.measure;
    uom.type = uom.edit_type ?? uom.type;
    this.cdRef.detectChanges();
  }

  async deleteUOM(uom: dataUOM) {
    let c = confirm(`Do you want to Delete the UOM ${uom.measure}?`)
    if (c) {
      showLoader(true);
      await this.firebaseService.deleteDocument(defaultConfig.collections.uom.name + "/" + uom.docId);
      notify("success", `UOM ${uom.measure} deleted successfully`);
      showLoader(false);
    }
  }

  async updateUOM(uom: dataUOM) {
    // Validate

    let isValid = true;

    // Type
    if (uom.type == null || uom.type == "")
      isValid = false;



    // abbr
    if (uom.abbr == null || uom.abbr == "")
      isValid = false;


    // measure
    if (uom.measure == null || uom.measure == "")
      isValid = false;


    if (isValid) {
      showLoader(true);

      let _new_uom: newUOM = {
        type: uom.type,
        abbr: uom.abbr,
        measure: uom.measure
      }

      await this.firebaseService.updateDocument(defaultConfig.collections.uom.name + "/" + uom.docId, _new_uom);

      uom.edit = false;
      this.cdRef.detectChanges();
      notify("success", `UOM ${uom.measure} updated successfully`);

      showLoader(false);

    }


  }


}
