//this file have been moved to common package
import {
  Message,
  Stan,
  Subscription,
  SubscriptionOptions,
} from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"]; //name of channel
  abstract queueGroupName: string; //also use for durablename
  abstract onMessage(data: T["data"], msg: Message): void; //function run when message is received
  protected ackWait: number = 5 * 1000;
  private client: Stan; //nats connected

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() //send all event that we emited in the past
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); //luu nhung da ack va chua ack cua subscription id
  }

  listen() {
    //set up subscription
    const subscription: Subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, //nhung listener ma sub queue group chi gui den listener 1 lan
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `Message received: ${this.subject} / ${
          this.queueGroupName
        } [${msg.getSequence()}]`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
