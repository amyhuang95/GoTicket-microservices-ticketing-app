# GoTicket

GoTicket is a streamlined e-commerce web application designed for buying and selling tickets. The application leverages a microservices architecture, with distinct services for authentication, orders, tickets, expiration, and payments. Each service operates within its own container, managed by Kubernetes.

The backend is developed using Node.js and Express.js, both written in TypeScript, and utilizes MongoDB for data storage. The frontend is crafted with React.js and Next.js, ensuring a responsive and dynamic user experience.

# Features

- Users can list tickets for events, making them available for purchase by other users.
- When a user initiates a ticket purchase, the ticket is locked for 1 minute, providing a window to complete the payment.
- During the lock period, the ticket is unavailable for purchase by others. If the payment is not completed within 1 minute, the ticket is released.
- Ticket prices can be modified as long as the ticket is not locked.

# Services

The data mangement between each microservices is done using [NATS Streaming Server](https://www.npmjs.com/package/node-nats-streaming).

| Name       | Description                                                                                                                                  | Events                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| auth       | User management (user registration, login, and logout)                                                                                       | UserCreated, UserUpdated                         |
| tickets    | Ticket management (ticket creation, editing, tracking, and locking)                                                                          | TicketCreated, TicketUpdated                     |
| orders     | Order management (order creation, editing, and tracking)                                                                                     | OrderCreated, OrderCancelled, OrderExpired       |
| expiration | Order cancellation. Automatically cancels orders after 1 minutes of creation.                                                                | OrderExpired                                     |
| payments   | Payment management (using Stripe to process credit card payments). Cancels orders if payments fail and completes orders if payments succeed. | ChargeCreated, OrderCancelled (if payment fails) |

# Routes

| Route             | Goal                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ |
| /auth/signin      | Display form to sign in                                                              |
| /auth/signup      | Display form to sign up for an account                                               |
| /auth/signout     | Sign out                                                                             |
| /                 | Display a list of all available tickets, including the links to purchase each ticket |
| /tickets/new      | Display form to create a new ticket                                                  |
| /tickets/ticketld | Display details about a specific ticket                                              |
| /orders/:orderid  | Display information about an order and the payment button                            |

# How to run

1. Install Docker Desktop, Skaffold, and [Ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/). Set up Stripe account and get the secret key.
2. Configure the load balancer's IP address to the domain name `goticket.dev`:

   Run below command and find the `EXTERNAL-IP` of the `ingress-nginx-controller` service.

   ```bash
   kubectl get services -n ingress-nginx
   ```

   Add the `EXTERNAL-IP` to your `/etc/hosts` file:

   ```plaintext
   <EXTERNAL-IP> goticket.dev
   ```

3. Create a secret for JWT secret key:
   ```bash
   kubectl create secret generic jwt-secret --from-literal=JWT_SECRET=your_secret_key
   ```
4. Create a secret for Stripe secret key:
   ```bash
   kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=your_stripe_secret_key
   ```
5. Run the following command in the root directory of the project:
   ```bash
   skaffold dev
   ```
6. Open your browser and go to `http://goticket.dev` to access the application.

---

Resource: [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/), Udemy.
