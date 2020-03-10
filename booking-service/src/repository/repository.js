'use strict';

const repository = (container) => {
    const {database: db} = container.cradle;

    const makeBooking = (user, booking) => {
        return new Promise((resolve, reject) => {
            const payload = {
                city: booking.city,
                userType: user.membership ? 'loyal' : 'normal',
                totalAmount: booking.totalAmount,
                cinema: {
                    name: booking.cinema,
                    room: booking.cinemaRoom,
                    seats: booking.seats.toString()
                },
                movie: {
                    title: booking.movie.title,
                    format: booking.movie.format,
                    schedule: booking.schedule
                }
            };

            db.collection('booking').insertOne(payload, (err, booked) => {
                if (err) {
                    reject(new Error('An error occurred registering a user booking, err: ' + err));
                    return;
                }
                resolve(payload);
            });
        });
    };

    const generateTicket = (paid, booking) => {
        return new Promise((resolve, reject) => {
            const payload = Object.assign({}, booking, {orderId: paid.charge.id, description: paid.description});
            db.collection('tickets').insertOne(payload, (err, ticket) => {
                if (err) {
                    reject(new Error('An error occurred registering a ticket, err: ' + err));
                    return;
                }
                resolve(payload);
            });
        });
    };

    const getOrderById = (orderId) => {
        return new Promise((resolve, reject) => {
            const ObjectID = container.resolve('ObjectID');
            const query = {_id: new ObjectID(orderId)};
            const response = (err, order) => {
                if (err) {
                    reject(new Error('An error occurred retrieving an order, err: ' + err));
                    return;
                }
                resolve(order);
            };
            db.collection('booking').findOne(query, {}, response);
        });
    };

    const disconnect = () => {
        db.close();
    };

    return Object.create({
        makeBooking,
        getOrderById,
        generateTicket,
        disconnect
    });
};

const connect = (container) => {
    return new Promise((resolve, reject) => {
        if (!container.resolve('database')) {
            reject(new Promise('Connection db is not supplied!'));
            return;
        }
        resolve(repository(container));
    });
};

module.exports = Object.assign({}, {connect});
