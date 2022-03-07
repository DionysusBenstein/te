export const methods = {
    market: {
        async last(args, callback) {
            const response = {
                message: 'market.last is working!',
                args
            };

            callback(null, response);
        },

        async deals(args, callback) {
            const response = {
                message: 'market.deals is working!',
                args
            };

            callback(null, response);
        },

        async kline(args, callback) {
            const response = {
                message: 'market.kline is working!',
                args
            };

            callback(null, response);
        },

        async status(args, callback) {
            const response = {
                message: 'market.status is working!',
                args
            };

            callback(null, response);
        },

        async status_today(args, callback) {
            const response = {
                message: 'market.status_today is working!',
                args
            };

            callback(null, response);
        }
    }
}