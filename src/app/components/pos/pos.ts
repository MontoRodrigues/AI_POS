import { Component, computed, signal, effect, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- External JS Functions ---
declare var showLoader: Function;
declare var notify: Function;
declare var hideMenu: Function;



// --- Interfaces ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  barcode: string;
  color: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

// --- Mock Data ---
const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items', icon: '🔍' },
  { id: 'coffee', name: 'Coffee', icon: '☕' },
  { id: 'bakery', name: 'Bakery', icon: '🥐' },
  { id: 'food', name: 'Hot Food', icon: '🍔' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
];

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Caramel Macchiato', category: 'coffee', price: 4.50, barcode: '1001', color: 'bg-amber-100', image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c8606af?auto=format&fit=crop&q=80&w=200' },
  { id: 'p2', name: 'Cappuccino', category: 'coffee', price: 3.75, barcode: '1002', color: 'bg-orange-100', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=200' },
  { id: 'p3', name: 'Iced Latte', category: 'coffee', price: 4.00, barcode: '1003', color: 'bg-stone-100', image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?auto=format&fit=crop&q=80&w=200' },
  { id: 'p4', name: 'Croissant', category: 'bakery', price: 2.50, barcode: '2001', color: 'bg-yellow-100', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=200' },
  { id: 'p5', name: 'Blueberry Muffin', category: 'bakery', price: 3.00, barcode: '2002', color: 'bg-purple-100', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=200' },
  { id: 'p6', name: 'Cheeseburger', category: 'food', price: 8.50, barcode: '3001', color: 'bg-red-100', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
  { id: 'p7', name: 'Club Sandwich', category: 'food', price: 7.25, barcode: '3002', color: 'bg-green-100', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=200' },
  { id: 'p8', name: 'Lemonade', category: 'drinks', price: 3.25, barcode: '4001', color: 'bg-lime-100', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=200' },
  { id: 'p9', name: 'Green Tea', category: 'drinks', price: 2.75, barcode: '4002', color: 'bg-emerald-100', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=200' },
];

@Component({
  selector: 'app-pos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.html',
  styleUrl: './pos.css'
})
export class Pos {

  // --- State Signals ---
  products = signal<Product[]>(PRODUCTS);
  categories = CATEGORIES;
  cart = signal<CartItem[]>([]); //iCartItem
  
  selectedCategoryId = signal<string>('all');
  
  searchQueryModel = signal<string>('');
  customerPhone = signal<string>('');
  discount = signal<number>(5); // Default 5% discount for demo
  paymentMethod = signal<'CASH' | 'UPI'>('CASH');
  cashGivenModel = signal<number>(0);
  
  // Date
  currentTime = Date.now();

  constructor() {
    // Update time every minute

    showLoader(false);
    setInterval(() => {
      this.currentTime = Date.now();
    }, 60000);
  }

  // --- Getters & Setters for Two-Way Binding ---
  get searchQuery() { return this.searchQueryModel(); }
  set searchQuery(val: string) { this.searchQueryModel.set(val); }

  get cashGiven() { return this.cashGivenModel(); }
  set cashGiven(val: number) { this.cashGivenModel.set(val); }


  // --- Computed Values ---

  /** Filters products based on Category AND Search Query */
  filteredProducts = computed(() => {
    const all = this.products();
    const cat = this.selectedCategoryId();
    const query = this.searchQueryModel().toLowerCase();

    return all.filter(p => {
      const matchesCategory = cat === 'all' || p.category === cat;
      const matchesSearch = p.name.toLowerCase().includes(query) || p.barcode.includes(query);
      return matchesCategory && matchesSearch;
    });
  });

  subtotal = computed(() => {
    return this.cart().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  });

  discountAmount = computed(() => {
    return this.subtotal() * (this.discount() / 100);
  });

  tax = computed(() => {
    return (this.subtotal() - this.discountAmount()) * 0.10; // 10% Tax
  });

  total = computed(() => {
    return this.subtotal() - this.discountAmount() + this.tax();
  });

  change = computed(() => {
    return this.cashGivenModel() - this.total();
  });

  // UPI String Generation
  upiString = computed(() => {
    // Basic UPI Intent format
    // pa=payee@vpa, pn=PayeeName, am=Amount
    const amount = this.total().toFixed(2);
    return `upi://pay?pa=shop@upi&pn=SwiftPOS&am=${amount}&cu=USD`; // Using USD/Generic currency
  });

  // QR Code URL (using a public API for demo purposes)
  qrCodeUrl = computed(() => {
    const data = encodeURIComponent(this.upiString());
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${data}`;
  });


  // --- Actions ---

  selectCategory(id: string) {
    this.selectedCategoryId.set(id);
    this.searchQueryModel.set(''); // Clear search on cat switch
  }

  addToCart(product: Product) {
    this.cart.update(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) {
        return items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string) {
    this.cart.update(items => items.filter(i => i.id !== productId));
  }

  updateQuantity(productId: string, delta: number) {
    this.cart.update(items => items.map(i => {
      if (i.id === productId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  }

  handleBarcodeSearch() {
    // If the search query matches a barcode exactly, add to cart and clear search
    const query = this.searchQueryModel();
    const product = this.products().find(p => p.barcode === query);
    
    if (product) {
      this.addToCart(product);
      this.searchQueryModel.set(''); // Reset for next scan
    }
    // Else, let it act as a filter (already handled by computed)
  }

  processPayment() {
    if (this.cart().length === 0) return;
    
    const method = this.paymentMethod();
    const total = this.total();
    
    let msg = '';
    if (method === 'CASH') {
       msg = `Payment Successful!\nReceived: $${this.cashGivenModel()}\nChange: $${this.change().toFixed(2)}`;
    } else {
       msg = `UPI Payment Verified!\nAmount: $${total.toFixed(2)}`;
    }
    
    // In a real app, this would save to DB. Here we just alert and reset.
    // Use a timeout to simulate processing
    setTimeout(() => {
      alert(msg);
      this.resetOrder();
    }, 500);
  }

  resetOrder() {
    this.cart.set([]);
    this.customerPhone.set('');
    this.cashGivenModel.set(0);
    this.searchQueryModel.set('');
    this.paymentMethod.set('CASH');
  }
}
