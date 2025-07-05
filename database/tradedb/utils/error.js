class HTTPError extends Error {
    status;
    code;

    constructor(status = 500, code = 'ERR_INTERNAL', msg='Internal Server Error') {
        super(msg)
        this.status  = status;
        this.code    = code;
        this.message = msg;
    }

    get error() {
        return { status: this.status, code: this.code, message: this.message };
    }
}

module.exports = HTTPError;