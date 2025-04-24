// orderHandler.ts
export async function handleOrder(orderData: { items: any[]; total: number }) {
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.error || "خطا در ثبت سفارش");
      }
  
      return result;
    } catch  {
      console.error("Order Error:");
      
    }
  }
  