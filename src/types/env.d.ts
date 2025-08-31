// src/types/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'test' | 'production' | 'staging';
        MONGO_URI: string;
        PORT?: `${number}`;
    }
}