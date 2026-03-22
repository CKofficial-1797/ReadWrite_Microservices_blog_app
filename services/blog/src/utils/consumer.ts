

import amqp from "amqplib";
import { redisClient } from "../server.js";
import { sql } from "./db.js";

interface CacheInvalidationMessage {
  action: string;
  keys: string[];
}

export const startCacheConsumer = async () => {
  try {
    console.log("amqp 1")
    const connection = await amqp.connect({
        protocol: "amqp",   
                    hostname:"localhost",
                    port: 5672,
                    username: "admin",
                    password: "admin123",
    });
    console.log("amqp 2")

    const channel = await connection.createChannel();

    const queueName = "cache-invalidation";

    await channel.assertQueue(queueName, { durable: true });

    console.log("✅ Blog Service cache consumer started");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(
            msg.content.toString()
          ) as CacheInvalidationMessage;

          console.log(
            "📩 Blog service recieved cache invalidation message",
            content
          );

          if (content.action === "invalidateCache") {
            for (const pattern of content.keys) {
              const keys = await redisClient.keys(pattern);

              if (keys.length > 0) {
                await redisClient.del(keys);

                console.log(
                  ` Blog service invalidated ${keys.length} cache keys matching: ${pattern}`
                );

                for (const key of keys) {
                      const parts = key.split(":");

                      const searchQuery = parts[1] || "";
                      const category = parts[2] || "";

                      let blogs;

                      if (searchQuery && category) {
                        blogs = await sql`
                          SELECT * FROM blogs 
                          WHERE title ILIKE ${"%" + searchQuery + "%"}
                          AND category = ${category}
                          ORDER BY create_at DESC
                        `;
                      } else if (searchQuery) {
                        blogs = await sql`
                          SELECT * FROM blogs 
                          WHERE title ILIKE ${"%" + searchQuery + "%"}
                          ORDER BY create_at DESC
                        `;
                      } else if (category) {
                        blogs = await sql`
                          SELECT * FROM blogs 
                          WHERE category = ${category}
                          ORDER BY create_at DESC
                        `;
                      } else {
                        blogs = await sql`
                          SELECT * FROM blogs 
                          ORDER BY create_at DESC
                        `;
                      }

                      await redisClient.set(
                        key,
                        JSON.stringify({ message: "Blogs fetched", blogs }),
                        { EX: 3600 }
                      );

                      console.log("🔄️ Cache rebuilt with key:", key);
                    }
              }
            }
          }

          channel.ack(msg);
        } catch (error) {
          console.error(
            "❌ Error processing cache invalidation in blog service:",
            error
          );

          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("❌ Failed to start rabbitmq consumer");
  }
};