const product_model = require("../../../database/productdb/models/product");
const HTTPError     = require("../utils/error");
const Cache         = require("../../../tools/cache/cache");
const Producer      = require("../../../tools/kafka/producer");
const ElasticEngine = require("../../../database/elasticsearch/src/elastic-engine");

const {makeQuery}   = require("../utils/search");

const DETAIL_KEY    = (id) => "product:detail:"+id;
const PRODUCT_TOPIC = 'product-changes';
const INDEX_NAME    = 'products';

class ProductController {
    static async list(req, res) {
        try {
            const query = makeQuery(req.query?.search || "", req.query.page || 1, req.query.limit || 10);
            const results = await ElasticEngine.getDocs(INDEX_NAME, query);

            return res.json({
                results: results?.hits?.hits.map(d => d._source) || [],
                pagination : {
                    page  : Number(req.query.page) || 1,
                    limit : Number(req.query.limit) || 10,
                    total : results?.hits?.total?.value || 0
                }
            });
        }
        catch(err) {
            console.log(err)
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
                return res.json(cached?.[0] || cached);

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

    static async getLots(req, res) {
        try {
            const {pid} = req.query

            let results;

            // // check cache first
            // product  = await Cache.get(DETAIL_KEY(id));

            if(!results)
                results = await product_model.getLots(pid);

            return res.json(results);
        }
        catch(err) {
            console.log(err)
            const error = err instanceof HTTPError ? err.error : new HTTPError().error;
            return res.status(error.status).json(error);
        }
    }

    static async getAvailable(req, res) {
        try {
            const { id } = req.params;

            let results;

            // check cache first
            // results  = await Cache.get(DETAIL_KEY(id));

            if(!results)
                results = await product_model.getAvailable(id);

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