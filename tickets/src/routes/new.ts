import { requireAuth, validateRequest } from '@goticket/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

/**
 * Router to create a new ticket.
 * Validate the title and price of the ticket before storing it in MongoDB.
 */

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Get the title and price from the request body
    const { title, price } = req.body;

    // Create a new ticket object with current user's ID
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    // Save the ticket to MongoDB
    await ticket.save();

    // Publish event to NATS: ticket:created
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      // Pull the data from the ticket object as the data types maybe redefined in the Ticket builder
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
