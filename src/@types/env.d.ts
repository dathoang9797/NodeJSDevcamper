// src/types/env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'test' | 'production' | 'staging';
        MONGO_URL: string;
        PORT?: `${number}`;
        JWT_EXPIRE: string;
        JWT_SECRET: string;
        JWT_COOKIE_EXPIRE: string;
        FILE_UPLOAD_PATH: string;
        MAX_FILE_UPLOAD: string;
    }
}