import Queue from "bull";

export interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  //connect to the instance of redis server running on pod
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    "i wan to publish an expiration: complate event for orderId",
    job.data.orderId
  );
});

export { expirationQueue };
