import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@goticket/common';

/**
 * Router to show a ticket.
 */

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  // Try to find the ticket from Ticket model
  const ticket = await Ticket.findById(req.params.id);

  // If ticket is null (not found)
  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
