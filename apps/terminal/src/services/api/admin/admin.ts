import * as dishes from '../dishes/dishes'
import * as tables from '../tables/tables'
import * as calls from '../calls/calls'
import * as order from '../order/order'
import * as user from '../user/user'

const api = {
    user: {
        sendEmail: user.sendRequestNumber
    },
    dishes: {
        findAll: dishes.findAll,
        find: dishes.find,
        create: dishes.create,
        update: dishes.update,
        delete: dishes.remove
    },
    tables: {
        findAll: tables.findAll,
        find: tables.find,
        create: tables.create,
        update: tables.update,
        delete: tables.remove
    },
    calls: {
        getAll: calls.getAllCalls
    },
    order: {
        getAll: order.getOrdersUser,
        delete: order.deleteOrder
    }
}

export default api