const http = require('http');
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
            handlers.postHandler(req, res);
            break;

        case 'PATCH':
            handlers.patchHandler(req, res);
            break;

        case 'DELETE':
            handlers.deleteHandler(endPoint, res);
            break;

        default:
            handlers.methodNotAllowedHandler(res);
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
