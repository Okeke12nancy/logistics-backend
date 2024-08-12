"use strict";

import { sendShipmentEmail } from "../services/shipment.js";

module.exports = {
  async updateShipmentLocation(ctx) {
    const { id } = ctx.params;
    const { currentLocation, eta, status } = ctx.request.body;

    if (!id || !currentLocation || !eta || !status) {
      return ctx.badRequest("Missing required fields");
    }

    try {
      // Fetch the shipment by ID
      const shipment = await strapi.services.shipment.findOne({ id });

      if (!shipment) {
        return ctx.notFound("Shipment not found");
      }

      // Update the shipment's current location, ETA, and status
      const updatedShipment = await strapi.services.shipment.update(
        { id },
        {
          currentLocation,
          ETA: eta,
          status,
          trackingHistory: [
            ...shipment.trackingHistory,
            {
              timestamp: new Date(),
              location: currentLocation,
              status,
            },
          ],
        }
      );

      if (shipment.customerEmail) {
        await sendShipmentEmail(
          shipment.customerEmail,
          `Your Shipment Status Update – Order #${shipment.orderId}`,
          `Dear Customer,\n\nYour shipment with order number #${shipment.orderId} has been updated. Here are the latest details:\n\nCurrent Location: ${currentLocation}\nStatus: ${status}\nEstimated Arrival: ${eta}\n\nYou can track your shipment in real-time using the tracking number ${shipment.trackingNumber}.\n\nThank you for choosing us!\n\nBest regards,\nCompany Name`
        );
      } else {
        console.warn("No customer email found for shipment:", id);
      }

      return ctx.send(updatedShipment);
    } catch (error) {
      console.error(
        "Error updating shipment location or sending email:",
        error
      );
      return ctx.internalServerError(
        "Failed to update shipment location or send email"
      );
    }
  },
};

// @ts-ignore
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::shipment.shipment");
