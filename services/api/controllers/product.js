const HTTPError = require("../utils/error");
const product   = require("../remote/product_service");

class ProductController {
    static async getProducts(req, res) {
        try {
            const result = await product.list();
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async createProduct(req, res) {
        try {
            const data = req.body;
            const result = await product.create(data);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getProduct(req, res) {
        try {
            const id     = req.params.id;
            const result = await product.detail(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async updateProduct(req, res) {
        try {
            const id     = req.params.id;
            const result = await product.update(id, req.body);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async deleteProduct(req, res) {
        try {
            const id     = req.params.id;
            const result = await product.delete(id);
            return res.status(200).json(result);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = ProductController;