const product_model = require("../../../database/productdb/models/product");
const HTTPError     = require("../utils/error");
const Cache         = require("../../../tools/cache/cache");
const Producer      = require("../../../tools/kafka/producer");

const DETAIL_KEY    = (id) => "product:detail:"+id;
const PRODUCT_TOPIC = 'product-changes';

class ProductController {
    static async list(req, res) {
        try {
            const results = await product_model.listProducts()
            return res.json(results);
        }
        catch(err) {
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async create(req, res) {
        try {
            const data = req.body;
            const results = await product_model.createProduct(data);

            // write through cache
            Cache.set(DETAIL_KEY(results.id), results);
            // publish this in product change topic for elastic search
            Producer.publish(PRODUCT_TOPIC, results.id, { action:"CREATE", payload: results });

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async detail(req, res) {
        try {
            const id      = req.params.id;

            // check cache first
            const cached  = await Cache.get(DETAIL_KEY(id));
            if(cached)
                return res.json(cached);

            const results = await product_model.getProduct(id);

            if(!results)
                throw new HTTPError(404, "ERR_NOT_FOUND", "Product not found");

            // update cache for next read
            Cache.set(DETAIL_KEY(id), results);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async update(req, res) {
        try {
            const id      = req.params.id;
            let product;

            // check cache first
            product  = await Cache.get(DETAIL_KEY(id));

            if(!product)
                product = await product_model.getProduct(id);

            if(!product)
                throw new HTTPError(404, "ERR_NOT_FOUND", "Product not found");

            const results = await product_model.updateProduct(id, req.body);

            // update cache for next read
            Cache.set(DETAIL_KEY(id), results);
            // publish this in product change topic for elastic search
            Producer.publish(PRODUCT_TOPIC, results.id, { action:"UPDATE", payload: results });

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async delete(req, res) {
        try {
            const id      = req.params.id;
            let product;

            // check cache first
            product  = await Cache.get(DETAIL_KEY(id));

            if(!product)
                product = await product_model.getProduct(id);

            if(!product)
                throw new HTTPError(404, "ERR_NOT_FOUND", "Product not found");

            const results = await product_model.deleteProduct(id);

            // delete from cache
            Cache.delete(DETAIL_KEY(id));
            // publish this in product change topic for elastic search
            Producer.publish(PRODUCT_TOPIC, results.id, { action:"DELETE", payload: results });

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }
}

module.exports = ProductController;