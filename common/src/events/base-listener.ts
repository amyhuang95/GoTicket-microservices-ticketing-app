import { Stan, Message } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  protected client: Stan;
  protected ackWait = 5 * 1000; // 5 seconds

  constructor(client: Stan) {
    this.client = client;
  }

  // Creae a subscription
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // deliver all the events that have not been emitted
      .setManualAckMode(true)
      .setAckWait(this.ackWait) // set the time to wait for the acknoledgement for 5 sec
      .setDurableName(this.queueGroupName); // make sure the event is not missed
  }

  // Listen for the message with the subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, // make sure event only goes to one instance of the listener
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
