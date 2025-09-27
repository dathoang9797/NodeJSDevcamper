// import { createClient } from "redis";

// const urlRedis = process.env.REDIS_URL || "redis://redis:6379";
// const DEFAULT_EXPIRATION = 3600;
// const client = await createClient({ url: urlRedis })
//     .on("error", (err) => console.log("Redis Client Error", err))
//     .on("connect", () => console.log("Redis connected"))
//     .connect();

// export function getOrSetCache(key: string, fetchFunction: () => Promise<any>) {
//     return client.get(key).then(async (cachedData: string) => {
//         if (cachedData) {
//             console.log("Cache hit");
//             return JSON.parse(cachedData);
//         } else {
//             console.log("Cache miss");
//             const data = await fetchFunction();
//             await client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(data));
//             return data;
//         }
//     });
// }