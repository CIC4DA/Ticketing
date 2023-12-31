import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

// MongoDB
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
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

    // listening to incomming events in NATS
    new OrderCreatedListener(natsWrapper.clientGetter).listen();
    new OrderCancelledListener(natsWrapper.clientGetter).listen();

    // connecting mongo DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Connected");
  } catch (error) {
    console.log("Error Connecting to MongoDB: ", error);
  }

  app.listen(4003, () => {
    console.log("Listining on port 4003!");
    console.log("New console log 2");
  });
};

start();
