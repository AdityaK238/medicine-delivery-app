const API_BASE_URL = "https://medicine-delivery-app-9e0j.onrender.com";

async function fetchOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Orders:", data);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

fetchOrders();
