export interface Product {
  id: number;
  title: string; // ← قبلاً عدد بود، ولی باید رشته باشه
  price: number;
  description: string;
  category: string;
  image?: string;
}

export interface CartItem {
  id?: number;
  name?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId?: number; 
  items: CartItem[];
  total: number;
  status?: string;
  createdAt?: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  address: string;
  phonenumber: number;
  nashionalcode: string;
  createdAt?: string;
}

export interface DatabaseUser {
  products: Product[];
}

export interface DatabaseUserList {
  users: User[];
  orders: Order[];
}
