"use strict";

import { sendEmail } from "../services/order.js";

module.exports = {
  async createOrder(ctx) {
    const {
      customerEmail,
      orderId,
      items,
      sender,
      receiver,
      estimatedDelivery,
      orderStatus,
    } = ctx.request.body;

    if (
      !customerEmail ||
      !orderId ||
      !items ||
      !sender ||
      !receiver ||
      !estimatedDelivery ||
      orderStatus
    ) {
      return ctx.badRequest("Missing required fields");
    }

    try {
      // Create order logic (e.g., save order to database)

      // Send order confirmation email
      await sendEmail(
        customerEmail,
        `Your Order Confirmation – Order #${orderId}`,
        `Dear Customer,\n\nYour order has been successfully placed with the following details:\n\nOrder Number: #${orderId}\nItems: ${items}\nSender: ${sender}\nReceiver: ${receiver}\nEstimated Delivery: ${estimatedDelivery}\n\nThank you for shopping with us!\n\nBest regards,\nCompany Name`
      );

      return ctx.send({ message: "Order created and email sent successfully" });
    } catch (error) {
      console.error("Error creating order or sending email:", error);
      return ctx.internalServerError("Failed to create order or send email");
    }
  },
};

module.exports = {
  // Update Order Status and Notify User
  async updateOrderStatus(ctx) {
    const { id } = ctx.params;
    const { newStatus } = ctx.request.body;

    // Validate input
    if (!id || !newStatus) {
      return ctx.badRequest("Missing required fields");
    }

    try {
      // Fetch the order
      const order = await strapi.services.order.findOne({ id });

      if (!order) {
        return ctx.notFound("Order not found");
      }

      // Update the order status
      order.orderStatus = newStatus;
      await strapi.services.order.update({ id }, order);

      // Send email notification
      if (order.customerEmail) {
        await sendEmail(
          order.customerEmail,
          "Order Status Update",
          `Your order status has been updated to: ${newStatus}`
        );
      } else {
        console.warn("No customer email found for order:", id);
      }

      // Return updated order
      return ctx.send(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      return ctx.internalServerError("Failed to update order status");
    }
  },

  // Track Order
  async trackOrder(ctx) {
    const { id } = ctx.params;
    const { location, status, eta } = ctx.request.body;

    // Validate input
    if (!id || !location || !status || !eta) {
      return ctx.badRequest("Missing required fields");
    }

    try {
      // Fetch order
      const order = await strapi.services.order.findOne({ id });

      if (!order) {
        return ctx.notFound("Order not found");
      }

      // Update order with new tracking information
      const updatedOrder = await strapi.services.order.update(
        { id },
        {
          location,
          status,
          eta,
          history: [
            ...order.history,
            {
              timestamp: new Date(),
              location,
              status,
            },
          ],
        }
      );

      // Return updated order details
      return ctx.send(updatedOrder);
    } catch (error) {
      console.error("Error tracking order:", error);
      return ctx.internalServerError("Failed to track order");
    }
  },
};

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order");
