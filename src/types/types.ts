export interface Product {
    id: number;
    title: number;
    price: number; 
    description: string;
    category: string;
    image?: string;
  }
  
  export type DatabaseUser = {
    products: Product[];
  };
  


  
  export interface Order {
    id: number;
    items?: string;
    total: string;
    status?:string ;
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
    nashionalcode:string;
    createdAt?: string;
    
  }
  
  export interface DatabaseUserList {
    users: User[];
    orders: Order[];
  }
  
