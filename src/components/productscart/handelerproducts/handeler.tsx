

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  items: CartItem[];
  total: number;
}

export const handleOrder = async (orderData: OrderData) => {
  try {
    console.log("Sending order to API:", orderData);
    
    // Calculate total to ensure accuracy
    const calculatedTotal = orderData.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );
    
    // Prepare data with correct total
    const verifiedOrderData = {
      ...orderData,
      total: parseFloat(calculatedTotal.toFixed(2)), // Ensure 2 decimal places
    };
    
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifiedOrderData),
    });

    console.log("API response status:", response.status);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      
      try {
        // Try to parse as JSON if possible
        const errorData = JSON.parse(errorText);
        return { error: errorData.error || "Failed to create order" };
      } catch  {
        // If not valid JSON, return the raw text
        return { error: errorText || `Server error: ${response.status}` };
      }
    }

    // Parse the response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Order Error:", error);
    return { error: "An unexpected error occurred" };
  }
};

// Function to get user's orders
export const getUserOrders = async () => {
  try {
    const response = await fetch("/api/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error response:", errorText);
      return { error: `Failed to fetch orders: ${response.status}` };
    }

    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { error: "An unexpected error occurred" };
  }
};