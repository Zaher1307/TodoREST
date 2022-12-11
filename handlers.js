const db = require('./model');

function writeResponse(res, statusCode, body) {
    if (body) {
        res.setHeader('Content-Type', 'application/json');
        res.write(body);
    }
    res.statusCode = statusCode;
    res.end();
}

async function getHandler(endPoint, res) {
    if (!endPoint[1]) {
        let todoItems = await db.getAllTodoItems();
        writeResponse(res, 200, JSON.stringify(todoItems));
    } else if (!isNaN(endPoint[1])) {
        try {
            let todoItem = await db.getTodoItem(endPoint[1]);
            writeResponse(res, 200, JSON.stringify(todoItem));
        } catch (err) {
            writeResponse(res, 404);
        }
    } else {
        writeResponse(res, 400);
    }
}

async function postHandler(res, body) {
    try {
        let responseBody = await db.addTodoItem(body);
        writeResponse(res, 200, JSON.stringify(responseBody));
    } catch (err) {
        writeResponse(res, 500);
    }
}

async function patchHandler(res, body) {
    try {
        let responseBody = await db.updateTodoItem(body);
        writeResponse(res, 200, JSON.stringify(responseBody));
    } catch (err) {
        writeResponse(res, 404);
    }
}

async function deleteHandler(endPoint, res) {
    if (!isNaN(endPoint[1])) {
        try {
            await db.deleteTodoItem(endPoint[1]);
            writeResponse(res, 200);
        } catch (err) {
            writeResponse(res, 404);
        }
    } else {
        writeResponse(res, 400);
    }
}


module.exports = {
    getHandler,
    postHandler,
    patchHandler,
    deleteHandler,
    writeResponse
}
