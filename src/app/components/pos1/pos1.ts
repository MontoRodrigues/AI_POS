import { ChangeDetectorRef, Component, computed, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from "@angular/common"
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { defaultConfig } from '../../config/config';
import { categoryStore, iCartItem, iCartPrice, iCustomer, iInventory, iInventoryChoice, iInventoryObject, iPaymentSummary, iProduct, iSale, iSaleProduct } from '../../interface/ipos';
import { PosCategory } from '../shared/pos-category/pos-category';
import { orderBy, where } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { orderByChild } from 'firebase/database';
import { iBarcodeScanned, iDevice, iDeviceAdd } from '../../interface/iconnector';
import { Subscription } from 'rxjs';

declare var showLoader: Function;
declare var notify: Function;
declare var getMachineId: Function;




@Component({
  selector: 'app-pos1',
  imports: [PosCategory, FormsModule, DecimalPipe, CommonModule],
  templateUrl: './pos1.html',
  styleUrl: './pos1.css'
})
export class Pos1 {

  user: any = null;
  user_initial: string | undefined = "";
  private subscribe_user: Subscription | undefined;

  // payment method
  paymentMethod = signal<'CASH' | 'UPI'>('CASH');
  cashGiven = signal<number>(0);
  changeGiven = computed(() => {
    return this.cashGiven() - this.grandTotal();
  });
  // UPI String Generation
  upiString = computed(() => {
    // Basic UPI Intent format
    // pa=payee@vpa, pn=PayeeName, am=Amount
    const amount = this.grandTotal().toFixed(2);
    return `upi://pay?pa=shop@upi&pn=SwiftPOS&am=${amount}&cu=USD`; // Using USD/Generic currency
  });

  // QR Code URL (using a public API for demo purposes)
  qrCodeUrl = computed(() => {
    const data = encodeURIComponent(this.upiString());
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`;
  });

  // Process Order
  async processOrder() {
    if (this.cart().length === 0) {
      alert("Your Cart is empty");
      return;
    }

    if (this.paymentMethod() == "CASH" && this.cashGiven() == 0) {
      alert("Please add Cash Given by the customer");
      return;
    }
    // -----Capture order details
    //- Products: productDocId, inventoryDocId, quantity, originalAmount, amount, tax, discount%, discountAmount 
    // payment method
    //- cash : Received, change 
    // - UPI: received, transaction id
    // sub total
    // discountAmount
    // taxAmount
    //GrandTotal
    // created by email
    // created on 
    // order id


    console.log("cart", this.cart());

    showLoader(true);

    // define Sales Object
    let order: iSale = {
      products: [],
      paymentMethod: 'CASH',
      paymentDetails: { receivedAmount: 0 },
      subTotal: this.paymentSummary().subTotal,
      discountAmount: this.paymentSummary().discountAmount,
      taxAmount: this.paymentSummary().taxAmount,
      grandTotal: this.grandTotal(),
      createdBy: this.user.email,
      createdOn: new Date(),
      orderId: self.crypto.randomUUID(),
      customerDocId: null
    }

    if (this.selectedCustomer != null)
      order.customerDocId = this.selectedCustomer.docId;

    // add Product Details
    this.cart().forEach(prod => {

      if (prod.inventory != null && prod.inventory[prod.inventoryIndex]) {
        const inventory = prod.inventory;
        const prodPrice = this.getCartItemPrice(prod);

        let discountPer = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (prod.sale != null && today >= prod.sale.validFrom && today <= prod.sale.validTill)
          discountPer = prod.sale.discount;

        order.products.push({
          productDocId: prod.docId,
          inventoryDocId: inventory[prod.inventoryIndex].docId,
          quantity: prod.quantity,
          originalAmount: prodPrice.originalPrice,
          amount: prodPrice.price,
          taxAmount: prodPrice.taxAmount,
          taxPer: prod.taxRate,
          discountPer: discountPer,
          discountAmount: prodPrice.discountAmount ? prodPrice.discountAmount : 0
        });
      }

    });

    // add payment details
    if (this.paymentMethod() == 'CASH') {
      order.paymentMethod = this.paymentMethod()
      order.paymentDetails = {
        receivedAmount: this.cashGiven(),
        changeReturned: this.changeGiven(),
        transactionId: null
      }
    } else if (this.paymentMethod() == 'UPI') {
      order.paymentMethod = this.paymentMethod()
      order.paymentDetails = {
        receivedAmount: this.grandTotal(),
        changeReturned: null,
        transactionId: null
      }
    }

    // add POS sales order to collection 
    await this.firebaseService.addDocument(defaultConfig.collections.sale.name, order);

    //--------update Inventory Quantity for each product 
    this.cart().forEach(async (prod) => {
      if (prod.inventory != null && prod.inventory[prod.inventoryIndex]) {
        const inventory = prod.inventory[prod.inventoryIndex];
        inventory.currentInventory = inventory.currentInventory - prod.quantity;
        inventory.sale = inventory.sale + prod.quantity;
        await this.firebaseService.updateDocument(defaultConfig.collections.products.name + "/" + prod.docId + "/inventory/" + inventory.docId, inventory);
      }
    });

    let msg = '';
    if (this.paymentMethod() === 'CASH') {
      msg = `Payment Successful!\nReceived: $${this.cashGiven()}\nChange: $${this.changeGiven().toFixed(2)}`;
    } else {
      msg = `UPI Payment Verified!\nAmount: $${this.grandTotal().toFixed(2)}`;
    }

    alert(msg);
    this.resetOrder();
    this.cdRef.detectChanges();
    showLoader(false);


  }

  resetOrder() {
    this.cart.set([]);
    this.cashGiven.set(0);


    this.customerPhone = "0000";
    this.customerPhoneError = "";

    this.customerName = "Walk-in";
    this.customerNameError = "";
    this.selectedCustomer = null;


    this.paymentMethod.set('CASH');

    this.searchProduct = "";
    this.searchProductSignal.set("");
    this.resetUPIScreen();
  }

  async resetUPIScreen() {
    let device = this.currentDevice();
    if (device && device.UPIScreen) {
      device.UPIScreen.UPIQrCode = null;
      await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + getMachineId(), device);
    }
  }

  // payment Summary
  paymentSummary = computed((): iPaymentSummary => {
    let s: iPaymentSummary = {
      subTotal: 0,
      discountAmount: 0,
      taxAmount: 0,
    }
    this.cart().forEach(c => {
      let d = this.getCartItemPrice(c);
      s.subTotal += d.originalPrice;
      if (d.discountAmount != null)
        s.discountAmount += d.discountAmount;

      s.taxAmount += d.price * (c.taxRate / 100);
    });

    // s.subTotal = Math.ceil(s.subTotal);
    // s.discountAmount = Math.ceil(s.discountAmount);
    // s.taxAmount = Math.ceil(s.taxAmount);
    return s;
  });

  grandTotal = computed(() => {
    return this.paymentSummary().subTotal - this.paymentSummary().discountAmount + this.paymentSummary().taxAmount;
  });

  //----------------- cart
  cart = signal<iCartItem[]>([]);


  getCartItemPrice(item: iCartItem): iCartPrice {
    if (item.sale != null) {
      // get todays date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (today >= item.sale.validFrom && today <= item.sale.validTill) {
        const price = (item.unitPrice - (item.unitPrice * (item.sale.discount / 100))) * item.quantity;
        const discountedPrice = (item.unitPrice * item.quantity) - price;
        return { price: price, discountAmount: discountedPrice, originalPrice: item.unitPrice * item.quantity, taxAmount: price * item.taxRate }

      }
      else
        return { price: item.unitPrice * item.quantity, discountAmount: null, originalPrice: item.unitPrice * item.quantity, taxAmount: (item.unitPrice * item.quantity) * item.taxRate }

    }
    else
      return { price: item.unitPrice * item.quantity, discountAmount: null, originalPrice: item.unitPrice * item.quantity, taxAmount: (item.unitPrice * item.quantity) * item.taxRate }
  }

  // if there is multiple inventory available ask the user to select one.
  multipleInventory: iProduct | null = null;
  selectInventoryToAddToCart(index: number) {
    // if multipleInventory is not null
    if (this.multipleInventory != null) {
      this.addToCart(this.multipleInventory, index);
    }
    else
      notify("error", "No Inventory found");

    // set multipleInventory to null so the popup goes away
    this.multipleInventory = null;
    this.cdRef.detectChanges();
  }


  // click on the product to add it to the cart
  addToCartClick(product: iProduct) {
    console.log("add cart click", product);

    // check if product has no inventory.
    if (product.inventory == null || product.inventory.length == 0) {
      notify("error", `Product:${product.name} is out of stock`);
      return;
    }
    // check if there is only one inventory
    else if (product.inventory.length == 1) {
      this.addToCart(product, 0);
    }
    // if multiple inventory is available. ask user to select one
    else if (product.inventory.length > 1) {

      // if the product is already added then no need to select the inventory
      const existing = this.cart().find(i => i.docId === product.docId);
      if (existing)
        this.addToCart(product, 0);
      else {
        // chose which Inventory to use;
        this.multipleInventory = product;
        this.cdRef.detectChanges();
      }
    }
  }

  // add to cart function
  addToCart(product: iProduct, index: number) {
    if (product.inventory != null && product.inventory[index]) {
      const inventory = product.inventory;

      this.cart.update(items => {
        const existing = items.find(i => i.docId === product.docId);
        if (existing) {
          return items.map(i => i.docId === product.docId ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...items, {
          ...product,
          quantity: 1,
          unitPrice: inventory[index].sellingPrice,
          discount: 0,
          inventoryID: inventory[index].docId,
          inventoryIndex: index
        }];
      });
      this.setPaymentMethod('CASH');
    }
  }
  // remove from cart function
  removeFromCart(docId: string) {
    this.cart.update(items => items.filter(i => i.docId !== docId));
    this.setPaymentMethod('CASH');
  }
  // update cart quantity
  updateQuantity(docId: string, delta: number) {
    this.cart.update(items => items.map(i => {
      if (i.docId === docId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  }

  async setPaymentMethod(method: 'CASH' | 'UPI') {
    if (method == 'UPI') {
      // update the amount and URL for QR Code
      console.log("Method is UPI");
      this.paymentMethod.set(method)
      if (this.currentDevice != null) {
        let device = this.currentDevice();
        if (device && device.UPIScreen) {
          device.UPIScreen.UPIQrCode = {
            URL: this.qrCodeUrl(),
            Amount: this.grandTotal(),
            timestamp: new Date()
          }
          console.log("updating QR", device);
          await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + getMachineId(), device);
        }
      }
    } else if (this.paymentMethod() == 'UPI' && method == 'CASH') {

      this.paymentMethod.set(method)

      if (this.currentDevice != null) {
        let device = this.currentDevice();
        if (device && device.UPIScreen) {
          device.UPIScreen.UPIQrCode = null;
          await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + getMachineId(), device);
        }
      }
    }


    this.paymentMethod.set(method)
  }

  //------------ end cart
  // category 
  private fb_subscribe_category: any;
  categoryList = signal<categoryStore[]>([]);
  selectedCategory = signal<string>('all');

  // product
  private fb_subscribe_product: any;
  productList = signal<iProduct[]>([]);

  // inventory
  private fb_subscribe_inventory: any;
  private inventory_list = signal<iInventoryObject>({});

  // ---------customer
  customerPhone: string = defaultConfig.pos.defaultCustomer.phoneNumber;
  customerPhoneError: string = "";

  customerName: string = defaultConfig.pos.defaultCustomer.name;
  customerNameError: string = "";
  selectedCustomer: iCustomer | null = defaultConfig.pos.defaultCustomer;

  async searchCustomer() {
    if (this.customerPhone == "0000" || this.customerPhone.length == 10) {
      this.customerPhoneError = "";
      let snapshot = await this.firebaseService.getCollection(defaultConfig.collections.customer.name, [where('phoneNumber', '==', this.customerPhone)]);
      let d = this.getDataFromCollection(snapshot);
      if (d.length > 0) {
        this.selectedCustomer = d[0];
        this.customerName = d[0].name;
      }
      else {
        this.selectedCustomer = null;
        this.customerName = "";
      }

      this.customerPhoneError = "";

      this.customerNameError = "";

      console.log("selected customer", this.selectedCustomer);
    } else if (this.customerPhone.length < 10) {
      this.customerPhoneError = "error-container";
      this.selectedCustomer = null;
      this.customerName == "Walk-in";
    }
    else if (this.customerPhone.length > 10) {
      this.customerPhoneError = "error-container";
      this.selectedCustomer = null;
      this.customerName == "Walk-in";
    }
  }

  async onCustomerNameChange() {
    if (this.customerName != "" && this.customerName != "Walk-in" && this.customerPhone != "0000" && this.selectedCustomer == null) {
      console.log("reached");
      // check if the customer exists?
      let snapshot = await this.firebaseService.getCollection(defaultConfig.collections.customer.name, [where('phoneNumber', '==', this.customerPhone)]);
      let d = this.getDataFromCollection(snapshot);
      if (d.length > 0) {
        this.selectedCustomer = d[0];
        this.customerName = d[0].name;
      }
      else {
        // add new customer and set selected customer
        let customer = {
          name: this.customerName,
          phoneNumber: this.customerPhone
        }

        // add new customer
        let doc = await this.firebaseService.addDocument(defaultConfig.collections.customer.name, customer);

        // set as selected customer
        this.selectedCustomer = {
          docId: doc.id,
          name: this.customerName,
          phoneNumber: this.customerPhone
        };

        this.cdRef.detectChanges();
      }
    }

  }

  //----------Search Product
  searchProduct: string = "";
  searchProductSignal = signal<string>("");

  handleSearch() {
    this.searchProductSignal.set(this.searchProduct);
  }

  clearSearch() {
    this.searchProduct = "";
    this.searchProductSignal.set("");
  }

  // filtered Category List
  filteredProducts = computed((): iProduct[] => {
    if (this.searchProductSignal() != "") {
      let searchToken = this.searchProductSignal().toLocaleLowerCase();

      return this.productList().filter((p) => {
        // search name
        if (p.name?.toLocaleLowerCase()?.includes(searchToken))
          return true;

        // search attributes
        for (let att of p.attributes) {
          if (att.value.toLocaleLowerCase().includes(searchToken))
            return true;
        }

        // search category path 
        for (let pt of p.categories.path) {
          if (pt.toLocaleLowerCase().includes(searchToken))
            return true;
        }

        //search barcode
        if (p.barcode.toLocaleLowerCase() == searchToken)
          return true;

        // search searchTokens
        for (let s of p.searchTokens) {
          if (s.toLocaleLowerCase().includes(searchToken))
            return true;
        }
        return false;

      });
    }
    else {
      if (this.selectedCategory() == "all")
        return this.productList();
      else {
        return this.productList().filter((p) => p.categories.categoryIds.includes(this.selectedCategory()));
      }
    }
  });

  // add inventory data to Products 
  updateInventory() {

    if (this.productList().length > 0 && Object.keys(this.inventory_list()).length > 0) {
      let p: iProduct[] = this.productList();
      for (let i = 0; i < p.length; i++) {
        if (this.inventory_list().hasOwnProperty(p[i].docId))
          p[i].inventory = this.inventory_list()[p[i].docId];
      }
      this.productList.set(p);
      this.cdRef.detectChanges();
      console.log("Product with Inventory", this.productList());
    }

  }

  // create Category JSON object
  // getCategoryObject(snapshot: any): categoryObject {
  //   let category: any = {};

  //   snapshot.forEach((doc: any) => {
  //     let d = doc.data();
  //     d["docId"] = doc.id;
  //     category[doc.id] = d;
  //   });
  //   return category;
  // }

  getCategoryArray(snapshot: any): categoryStore[] {
    let p: categoryStore[] = [];
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }

  // Get collection data as Array
  getDataFromCollection(snapshot: any): any[] {
    let p: any = []
    snapshot.forEach((doc: any) => {
      let d = doc.data();
      d["docId"] = doc.id;
      p.push(d);
    });
    return p;
  }

  constructor(private cdRef: ChangeDetectorRef, private authService: AuthService, private firebaseService: FirebaseService) {
    // get auth user
    this.subscribe_user = this.authService.user$.subscribe(authState => {
      if (authState !== null) {
        this.user = authState;

        this.user_initial = authState.displayName?.split(" ").map(word => word.charAt(0)).join('');
      }
      else {
        this.user = null;
      }
    });
  }

  //--------------------current device 
  private fb_subscribe_devices: any;
  currentDevice = signal<iDeviceAdd | null>(null);


  async createConnectionCode() {
    let l = false;
    let code = 0;
    while (!l) {
      code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      console.log("new Code Generated", code);
      let snapshot = await this.firebaseService.getCollection(defaultConfig.collections.customer.name, [where('scanner.connectionCode', '==', code)]);
      let d = this.getDataFromCollection(snapshot);
      console.log("find the code in device collection", d)
      if (d.length == 0)
        l = true;
    }
    return code.toString();
  }

  // connected devices as scanner and UPI QR Code Screen 
  async setMachineSessionForDevices() {
    let d = await this.firebaseService.getDocument(defaultConfig.collections.devices.name, getMachineId());
    console.log("device data", d);

    if (d != null) {
      // if session for this device exists then update the scan and UPI QUR code values to null 
      let device: iDevice = d;
      device.UPIScreen.UPIQrCode = null;
      device.scanner.current_scan = null;
      await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + getMachineId(), device);
    }
    else {
      // if the session docent exists then create a new session
      let code = await this.createConnectionCode();
      console.log("connection code", code);
      let device: iDeviceAdd = {
        scanner: {
          connectionCode: code,
          status: 'WAITING',
          last_heartbeat: null,
          current_scan: null
        },
        UPIScreen: {
          connectionCode: code,
          status: 'WAITING',
          last_heartbeat: null,
          UPIQrCode: null
        }
      };
      await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + getMachineId(), device);
    }

    //subscribe to device document
    this.fb_subscribe_devices = this.firebaseService.subscribeToDocument(defaultConfig.collections.devices.name, getMachineId(), (snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.data();

        //Check for new bar codes
        let barcode: iBarcodeScanned | null = null;
        if (data["scanner"] != null && data["scanner"]["current_scan"] != null) {
          data["scanner"]["current_scan"]["timestamp"] = new Date(data["scanner"]["current_scan"]["timestamp"].seconds * 1000 + data["scanner"]["current_scan"]["timestamp"].nanoseconds / 1000000);

          if (this.currentDevice()?.scanner.current_scan?.timestamp) {
            if (this.currentDevice()?.scanner.current_scan?.timestamp != data["scanner"]["current_scan"]["timestamp"])
              barcode = data["scanner"]["current_scan"];
          }
          else
            barcode = data["scanner"]["current_scan"];

          if (barcode != null) {
            // search product and add to cart;
            let prod = this.productList().filter((p) => p.barcode.toLocaleLowerCase() == barcode?.code);
            if (prod.length > 0)
              this.addToCartClick(prod[0]);
            console.log("scanned Product", prod);
          }

        }

        this.currentDevice.set(data as iDeviceAdd);
        // const barcode = this.currentDevice()?.scanner.current_scan;
        console.log("barcode", barcode);
        console.log("current device", this.currentDevice());
      }
    });

  }

  // payOrder: boolean = false;
  // async updateUPIScreen() {
  //   if (this.currentDevice != null) {
  //     let device = this.currentDevice();
  //     if (device && device.UPIScreen) {
  //       device.UPIScreen.UPIQrCode = {
  //         URL: this.qrCodeUrl(),
  //         Amount: this.grandTotal(),
  //         timestamp: new Date()
  //       }
  //       await this.firebaseService.setDocument(defaultConfig.collections.devices.name + "/" + getMachineId(), device);
  //     }
  //   }
  // }

  // async payForOrderClick() {
  //   this.payOrder = true;
  //   await this.updateUPIScreen();
  // }





  //--------------------------

  logout() {
    this.authService.signOut();

  }

  ngOnInit() {
    // subscribe to Category collection
    this.fb_subscribe_category = this.firebaseService.subscribeToCollection(defaultConfig.collections.category.name, (snapshot) => {
      this.categoryList.set(this.getCategoryArray(snapshot));

      console.log("categoryList", this.categoryList());
    }, [orderBy('name')]);

    //subscribe to Products Collection
    this.fb_subscribe_product = this.firebaseService.subscribeToCollection(defaultConfig.collections.products.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);
      for (let x = 0, l = p.length; x < l; x++) {
        if (p[x]["sale"] != null) {
          p[x]["sale"].validFrom = p[x]["sale"].validFrom != null ? new Date(p[x]["sale"].validFrom.seconds * 1000 + p[x]["sale"].validFrom.nanoseconds / 1000000) : null;
          p[x]["sale"].validTill = p[x]["sale"].validTill != null ? new Date(p[x]["sale"].validTill.seconds * 1000 + p[x]["sale"].validTill.nanoseconds / 1000000) : null;
        }

        p[x]["inventory"] = null;
      }
      this.productList.set(p);
      this.updateInventory();
      console.log("Product List", this.productList())
    }, [orderBy('name')]);

    // subscribe to firebase Inventory Group Collection
    this.fb_subscribe_inventory = this.firebaseService.subscribeToCollectionGroup(defaultConfig.collections.inventory.name, (snapshot) => {
      let p = this.getDataFromCollection(snapshot);

      for (let x = 0, l = p.length; x < l; x++) {
        p[x]["inventoryDate"] = new Date(p[x].inventoryDate.seconds * 1000 + p[x].inventoryDate.nanoseconds / 1000000);
      }

      p = p.sort((a, b) => {
        return b.inventoryDate - a.inventoryDate;
      });

      let inv: iInventoryObject = {};
      for (let x = 0, l = p.length; x < l; x++) {
        if (!inv.hasOwnProperty(p[x].productDocId))
          inv[p[x].productDocId] = []
        inv[p[x].productDocId].push(p[x]);
      }

      this.inventory_list.set(inv);
      this.updateInventory();
      console.log("inventory", this.inventory_list());

    }, [where('currentInventory', '>', 0), orderBy('inventoryDate', 'desc')]);

    // subscribe for Device Connections
    this.setMachineSessionForDevices();

    showLoader(false);

  }

  ngOnDestroy() {
    if (this.fb_subscribe_category) {
      this.fb_subscribe_category();
    }
    if (this.fb_subscribe_product) {
      this.fb_subscribe_product();
    }

    if (this.fb_subscribe_inventory) {
      this.fb_subscribe_inventory();
    }

    if (this.subscribe_user) {
      this.subscribe_user.unsubscribe()
    }

    if (this.fb_subscribe_devices) {
      this.fb_subscribe_devices.unsubscribe()
    }


  }
}
