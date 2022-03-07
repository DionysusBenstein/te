export const methods = {
    balance: {
        async history(args, callback) {
            const response = {
                message: 'balance.history is working!',
                args
            };

            callback(null, response);
        }
    },

    order: {
        async deals(args, callback) {
            const response = {
                message: 'order.deals is working!',
                args
            };

            callback(null, response);
        },

        async finished(args, callback) {
            const response = {
                message: 'order.finished is working!',
                args
            };

            callback(null, response);
        },

        async finished_detail(args, callback) {
            const response = {
                message: 'order.finished_detail is working!',
                args
            };

            callback(null, response);
        }
    },

    market: {
        async user_deals(args, callback) {
            const response = {
                message: 'market.user_deals is working!',
                args
            };

            callback(null, response);
        }
    }
}