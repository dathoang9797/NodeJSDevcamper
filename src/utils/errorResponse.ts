class ErrorResponse extends Error {
    public statusCode: number;
    code: number;
    value: any;

    constructor(message: string, statusCode: number, value?: any) {
        super(message);
        this.statusCode = statusCode;
        this.value = value;
    }
}

export default ErrorResponse;