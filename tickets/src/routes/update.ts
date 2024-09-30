import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { app } from '../app';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@goticket/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

/**
 * Router to update a ticket
 */

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // try to find the ticket in Ticket model
    const ticket = await Ticket.findById(req.params.id);

    // if the ticket does not exist, throw error
    if (!ticket) {
      throw new NotFoundError();
    }

    // If the user who requests edits does not own the ticket
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update the ticket and save to the DB
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    // Publish event to NATS: ticket:updated
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
