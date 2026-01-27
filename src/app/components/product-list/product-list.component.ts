import { Component, inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  
  // Expose the signals from the service
  products = this.productService.products;
  totalValue = this.productService.totalValue;

  addRandomProduct(): void {
    const randomId = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 1000);
    
    const newProduct: Product = {
      id: randomId,
      name: `Product ${randomId}`,
      price: randomPrice
    };
    
    this.productService.addProduct(newProduct);
  }
}
