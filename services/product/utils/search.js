function makeQuery(keywords, page, limit) {
    const query = {
        size : limit || 10,
        from : ((page-1)*limit) || 0
    }

    if(keywords.length > 0) {
        query.query = {
            multi_match: {
                query: keywords,
                fields: ['name', 'hsn', 'brand']
            }
        }
    }

    return query;
}

module.exports = {makeQuery}