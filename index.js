const http = require('http');
const jsonBody = require('body/json');
const {
    parse
} = require('url');
const db = require('./model')
const handlers = require('./handlers');

const server = http.createServer((req, res) => {
    let endPoint = parse(req.url).path.slice(1).split('/');
    if (endPoint[0] !== 'todolist') {
        handlers.badRequestHandler(res);
        return;
    }

    switch (req.method) {
        case 'GET':
            handlers.getHandler(endPoint, res);
            break;

        case 'POST':
            jsonBody(req, res, (err, body) => {
                if (err) {
                    handlers.writeResponse(res, 400);
                    return;
                }
                handlers.postHandler(res, body);
            });
            break;

        case 'PATCH':
            jsonBody(req, res, (err, body) => {
                if (err) {
                    handlers.writeResponse(res, 400);
                    return;
                }
                handlers.patchHandler(res, body);
            });
            break;

        case 'DELETE':
            handlers.deleteHandler(endPoint, res);
            break;

        default:
            handlers.writeResponse(res, 405);
            break;
    }
});

try {
    db.initDatabase();
    server.listen(8000);
} catch (err) {
    console.error(err.message);
    process.exit(1);
}
