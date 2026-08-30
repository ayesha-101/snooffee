import type { Product } from '@/data/products';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    console.error('Failed to fetch products from database:', error);
    return [];
  }
}

export async function createProduct(product: Product): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  } catch (error) {
    console.error('Failed to create product:', error);
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  } catch (error) {
    console.error('Failed to update product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Failed to delete product:', error);
    return false;
  }
}
