import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Private writable signal for products
  private productsSignal = signal<Product[]>([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
    { id: 4, name: 'Monitor', price: 300 }
  ]);
  
  // Public readonly signal for components
  public readonly products = this.productsSignal.asReadonly();
  
  // Computed signal for total value
  public readonly totalValue = computed(() => 
    this.products().reduce((sum, product) => sum + product.price, 0)
  );

  constructor() {
    // Effect to log when product list changes
    effect(() => {
      const count = this.products().length;
      const total = this.totalValue();
      console.log(`Product list changed. New count: ${count}, Total value: $${total}`);
    });
  }

  // Method to add a new product
  addProduct(product: Product): void {
    this.productsSignal.update(currentProducts => [...currentProducts, product]);
  }

  // Method to remove a product by id
  removeProduct(id: number): void {
    this.productsSignal.update(currentProducts => 
      currentProducts.filter(product => product.id !== id)
    );
  }
}
