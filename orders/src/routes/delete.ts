import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@goticket/common';
import { Order, OrderStatus } from '../models/orders';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    // Find the order id
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      throw new NotFoundError();
    }

    // Check if the order belongs to the current user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update the order status to cancelled
    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publish an event that the order was cancelled

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
