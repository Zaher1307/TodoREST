const db = require('./model');
const jsonBody = require('body/json');

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

async function postHandler(req, res) {
    jsonBody(req, res, async (err, body) => {
        if (err) {
            badRequestHandler(res);
            return;
        }
        try {
            let responseBody = await db.addTodoItem(body);
            writeResponse(res, 200, JSON.stringify(responseBody));
        } catch (err) {
            writeResponse(res, 500);
        }
    });
}

async function patchHandler(req, res) {
    jsonBody(req, res, async (err, body) => {
        if (err) {
            badRequestHandler(res);
            return;
        }
        try {
            let responseBody = await db.updateTodoItem(body);
            writeResponse(res, 200, JSON.stringify(responseBody));
        } catch (err) {
            writeResponse(res, 404);
        }
    });
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

function badRequestHandler(res) {
    writeResponse(res, 400);
}

function methodNotAllowedHandler(res) {
    writeResponse(res, 405);
}

module.exports = {
    getHandler,
    postHandler,
    patchHandler,
    deleteHandler,
    badRequestHandler,
    methodNotAllowedHandler
}
