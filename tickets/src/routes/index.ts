import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

/**
 * Router to show a list of tickets.
 */

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined, // filter out the reserved tickets
  });
  res.send(tickets);
});

export { router as indexTicketRouter };
