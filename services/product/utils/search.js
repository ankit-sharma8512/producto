function makeQuery(keywords, page, limit) {
    const query = {
        size : limit || 10,
        from : ((page-1)*limit) || 0
    }

    if(Array.isArray(keywords))
        keywords = keywords.join(" ").trim()

    console.log(keywords)

    if(keywords.length > 0) {
        query.query = {
            bool : {
                should: [
                    {
                        multi_match: {
                            query  : keywords,
                            fields : ['name', 'hsn', 'brand']
                        }
                    },
                    {
                        match : {
                            name : {
                                query     : keywords,
                                fuzziness : "AUTO"
                            }
                        }
                    },
                    {
                        prefix: {
                            brand: keywords
                        }
                    }
                ]
            }

        }
    }

    return query;
}

module.exports = {makeQuery}