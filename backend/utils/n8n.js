
const sendOrderToN8n = async (order, customer) => {
  try {
    const payload = {
      event: "order.created",

      order: {
        orderId: order._id.toString(),

        customerName: customer.name,
        customerEmail: customer.email,

        totalPrice: order.totalPrice,

        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,

        items: order.items.map((item) => ({
          title: item.title,
          qty: item.qty,
          price: item.price
        }))
      }
    };

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "x-n8n-secret": process.env.N8N_WEBHOOK_SECRET
      },

      body: JSON.stringify(payload),

      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`n8n returned ${response.status}`);
    }

    console.log("Order successfully sent to n8n");

  } catch (error) {
    console.error("n8n automation failed:", error.message);
  }
};

module.exports = sendOrderToN8n;
