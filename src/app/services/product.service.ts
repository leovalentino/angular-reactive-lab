import { Injectable, computed, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { startWith, switchMap, tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  
  // Refresh trigger
  private refresh$ = new Subject<void>();
  
  // Loading state
  public loading = signal<boolean>(false);
  
  // Products from API
  private productsObservable = this.refresh$.pipe(
    startWith(null), // Trigger initial load
    tap(() => this.loading.set(true)),
    switchMap(() => 
      this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts').pipe(
        tap(() => this.loading.set(false)),
        // Map API response to our Product interface
        map(posts => posts.slice(0, 10).map(post => ({
          id: post.id,
          name: post.title.substring(0, 20),
          price: post.id * 10
        }))),
        catchError(error => {
          console.error('Error fetching products:', error);
          this.loading.set(false);
          return of([]);
        })
      )
    )
  );
  
  // Convert observable to signal
  public products = toSignal(this.productsObservable, { initialValue: [] });
  
  // Computed signal for total value
  public totalValue = computed(() => 
    this.products().reduce((sum, product) => sum + product.price, 0)
  );

  constructor() {
    // Trigger initial load
    this.refresh$.next();
  }

  // Method to trigger refresh
  refresh(): void {
    this.refresh$.next();
  }

  // Method to add a new product (now local only)
  addProduct(product: Product): void {
    // Since we're using API data, we can't directly update the signal
    // For now, we'll just refresh to get new data
    // In a real app, you'd make a POST request and then refresh
    console.log('Adding product:', product);
    // For demo purposes, we'll just refresh
    this.refresh();
  }

  // Method to remove a product by id
  removeProduct(id: number): void {
    // Similar to addProduct, in a real app you'd make a DELETE request
    console.log('Removing product with id:', id);
    this.refresh();
  }
}
