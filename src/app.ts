import express from 'express';
import path from 'path';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xss } from 'express-xss-sanitizer';
import hpp from 'hpp';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import routerBootcamps from "#src/routers/bootcamps.ts";
import routerCourses from "#src/routers/courses.ts";
import routerAuth from "#src/routers/auth.ts";
import routerUsers from "#src/routers/users.ts";
import routerReviews from "#src/routers/reviews.ts";
import morgan from 'morgan';
import errorHandler from './middleware/error.ts';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { getOrSetCache } from './utils/getOrSetCache.ts';
import "#src/config/index.ts";

const app = express();
const port = process.env.PORT || 3000;

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

//static folder
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('query parser', 'extended');

//Body parser
app.use(express.json());

//File uploading
app.use(fileUpload());

// 🛡️ Set HTTP security headers bằng helmet()
// Helmet tự động thêm/cấu hình nhiều HTTP headers bảo mật
// → Giúp bảo vệ app khỏi các lỗ hổng phổ biến như XSS, clickjacking, sniffing...
// Tài liệu: https://www.npmjs.com/package/helmet
app.use(helmet());

// 🧹 Ngăn chặn XSS (Cross-Site Scripting) qua dữ liệu input
// Middleware xss-clean sẽ sanitize req.body, req.query, req.params
// → Xóa/encode các đoạn script độc hại mà user có thể chèn vào form/input
// Tài liệu: https://www.npmjs.com/package/xss-clean
app.use(xss());

// 🔒 Sanitize dữ liệu để ngăn NoSQL Injection (MongoDB Injection)
// Ở Mongo, attacker có thể gửi payload như { "email": { "$gt": "" } }
// → Nếu không sanitize, query có thể trả về toàn bộ user
// mongoSanitize loại bỏ các key bắt đầu bằng $ hoặc chứa dấu . trong object
// Ở đây ta áp dụng cho req.body và req.params (bạn có thể thêm req.query nếu muốn)
// Tài liệu: https://www.npmjs.com/package/express-mongo-sanitize
app.use((req, _res, next) => {
    req.body = mongoSanitize.sanitize(req.body);
    req.params = mongoSanitize.sanitize(req.params);
    next();
});

// 🚦 Rate limiting để chống tấn công brute-force / DDoS
// Mỗi IP chỉ được phép gửi tối đa `max` request trong khoảng thời gian `windowMs`
// Ở đây: 100 requests / 10 phút
// Nếu vượt quá, middleware sẽ trả về lỗi 429 (Too Many Requests)
// Tài liệu: https://www.npmjs.com/package/express-rate-limit
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 10 phút
    max: 100                 // giới hạn 100 requests / IP
});
app.use(limiter);

// 🚧 Prevent HTTP Parameter Pollution (HPP) attacks
// Ví dụ: /search?role=admin&role=user
// Nếu không chặn, req.query.role có thể là ["admin", "user"]
// -> nguy cơ bypass logic phân quyền, filter, validation
// hpp() sẽ chỉ giữ lại giá trị cuối cùng (mặc định), giúp an toàn hơn
// Tài liệu: https://www.npmjs.com/package/hpp
app.use(hpp());

// 🌐 Enable CORS (Cross-Origin Resource Sharing)
// Cho phép frontend (khác domain/port) gọi API
// Mặc định app.use(cors()) = cho phép tất cả origin (an toàn cho dev, nhưng không nên để production)
// Có thể config cụ thể: origin, methods, headers, credentials...
// Tài liệu: https://www.npmjs.com/package/cors
app.use(cors());

//Cookie parser
app.use(cookieParser());

//redis
app.get(`/photos/:id`, async (req, res) => {
    const albumId = req.query.albumId;
    const photos = await getOrSetCache(`photos:${albumId}`, async () => {
        let url = `https://jsonplaceholder.typicode.com/photos`;
        if (albumId)
            url += `?albumId=${albumId}`;

        const rsp = await fetch(url);
        return await rsp.json();
    });
    return res.status(200).json(photos);
});

app.use("/api/v1/bootcamps", routerBootcamps);
app.use("/api/v1/courses", routerCourses);
app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/users", routerUsers);
app.use("/api/v1/reviews", routerReviews);
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});