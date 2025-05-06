export interface Product {
  id?: number;
  title: string;
  price: number;
  description?: string;
  image?: string;
}

export interface CartItem {
  id?: string;
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
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  address: string;
  phonenumber?: string;
  nashionalcode: string;
  city: string;
  postalcode?: string; 
  createdAt?: string;
}

export interface DatabaseUser {
  products: Product[];
}

export interface DatabaseUserList {
  users: User[];
  orders: Order[];
}

