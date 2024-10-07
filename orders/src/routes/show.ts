import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@goticket/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    // Find the order with the order id and the associated ticket
    const order = await Order.findById(req.params.orderId).populate('ticket');

    // Check wheter the order exists
    if (!order) {
      throw new NotFoundError();
    }

    // Check if the order belongs to the current user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
