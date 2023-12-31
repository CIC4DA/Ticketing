import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

// defining the interface of the data inside job of queue
interface Payload {
  orderId: string;
}

// creating a instance of a queue
// second part is the options object which tells the queue where to connect
const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// this when the queue will process the job, returning from redis database
expirationQueue.process(async (job) => {
  console.log("COMPLETING THE UQUEUE");
  new ExpirationCompletePublisher(natsWrapper.clientGetter).publish({
    orderId: job.data.orderId
  });
});

export { expirationQueue };
