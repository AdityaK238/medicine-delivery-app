const API_BASE_URL = "https://medicine-delivery-app-9e0j.onrender.com"; // Use your Render backend URL

async function fetchOrders() {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    const data = await response.json();
    console.log(data);
}
