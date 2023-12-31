
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper";

// MongoDB
const start = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.REDIS_HOST) {
    throw new Error("REDIS_HOST must be defined");
  }

  try {
    // connecting node-nats-streaming
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // on closing the nats connection
    natsWrapper.clientGetter.on("close", () => {
      console.log("NATS connection Closed!");
      process.exit();
    });

    // if nats connection get killed suddenly
    process.on("SIGINT", () => natsWrapper.clientGetter.close());
    process.on("SIGTERM", () => natsWrapper.clientGetter.close());

    //listening to incomming events in NATS
    new OrderCreatedListener(natsWrapper.clientGetter).listen();

  } catch (error) {
    console.log(error);
  }
};

start();
