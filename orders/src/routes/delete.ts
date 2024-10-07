import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@goticket/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    // Find the order id
    const { orderId } = req.params;

    // Find the order and associated ticket
    const order = await Order.findById(orderId).populate('ticket');

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
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
