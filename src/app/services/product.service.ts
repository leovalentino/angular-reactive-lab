import { Injectable, signal, computed, effect } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Private writable signal for products
  private productsSignal = signal<Product[]>([]);
  
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
      console.log(`Product list changed. New count: ${count}`);
    });
  }

  // Method to add a new product
  addProduct(product: Product): void {
    this.productsSignal.update(currentProducts => [...currentProducts, product]);
  }
}
