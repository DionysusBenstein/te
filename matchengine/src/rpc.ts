export const methods = {
    asset: {
        async list(args, callback) {
            const response = {
                message: 'asset.list is working!',
                args
            };

            callback(null, response);
        },

        async summary(args, callback) {
            const response = {
                message: 'asset.summary is working!',
                args
            };

            callback(null, response);
        }
    },

    balance: {
        async query(args, callback) {
            const response = {
                message: 'balance.query is working!',
                args
            };

            callback(null, response);
        },

        async update(args, callback) {
            const response = {
                message: 'balance.update is working!',
                args
            };

            callback(null, response);
        }
    },

    order: {
        async put_limit(args, callback) {
            const response = {
                message: 'order.put_limit is working!',
                args
            };

            callback(null, response);
        },

        async put_market(args, callback) {
            const response = {
                message: 'order.put_market is working!',
                args
            };

            callback(null, response);
        },

        async cancel(args, callback) {
            const response = {
                message: 'order.cancel is working!',
                args
            };

            callback(null, response);
        },

        async book(args, callback) {
            const response = {
                message: 'order.book is working!',
                args
            };

            callback(null, response);
        },

        async depth(args, callback) {
            const response = {
                message: 'order.depth is working!',
                args
            };

            callback(null, response);
        },

        async pending(args, callback) {
            const response = {
                message: 'order.pending is working!',
                args
            };

            callback(null, response);
        },

        async pending_detail(args, callback) {
            const response = {
                message: 'order.pending_detail is working!',
                args
            };

            callback(null, response);
        }
    },

    market: {
        async list(args, callback) {
            const response = {
                message: 'market.list is working!',
                args
            };

            callback(null, response);
        },

        async summary(args, callback) {
            const response = {
                message: 'market.summary is working!',
                args
            };

            callback(null, response);
        }
    }
}