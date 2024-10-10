/**
 * Set up a Strip instance to be used in other files.
 */

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2024-09-30.acacia',
});
