const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('todo.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err);
    }
});
const util = require('util');
let nextId = 1;

async function initDatabase() {
    let sql = `CREATE TABLE IF NOT EXISTS todo(id INTEGER PRIMARY KEY, todoItem VARCHAR(255) NOT NULL, complete BOOLEAN NOT NULL);`;

    let run = util.promisify(db.run).bind(db);
    await run(sql);

    let get = util.promisify(db.get).bind(db);
    let row = await get('SELECT max(id) AS maxID FROM todo');
    if (row.maxID) {
        nextId = row.maxID + 1;
    }
}

async function getAllTodoItems() {
    let sql = `SELECT * FROM todo;`;

    let all = util.promisify(db.all).bind(db);

    return await all(sql);
}

async function getTodoItem(id) {
    let sql = `SELECT * FROM todo WHERE id = ${id};`;

    let get = util.promisify(db.get).bind(db);
    let todoItem = await get(sql);
    if (!todoItem) {
        throw new Error('todo item not found');
    }

    return todoItem;
}

async function addTodoItem(todo) {
    let {
        todoItem,
        complete
    } = todo;
    let sql = `insert into todo(id, todoItem, complete) values (?, ?, ?);`;

    let run = util.promisify(db.run).bind(db);
    await run(sql, [nextId, todoItem, complete])

    return {
        id: nextId++,
        todoItem,
        complete
    };
}

async function updateTodoItem(todo) {
    let {
        id,
        todoItem,
        complete
    } = todo;
    let sql = `UPDATE todo SET todoItem = ?, complete = ? WHERE id = ?;`;

    await getTodoItem(id);

    let run = util.promisify(db.run).bind(db);
    await run(sql, [todoItem, complete, id]);

    return todo;
}

async function deleteTodoItem(id) {
    let sql = `DELETE FROM todo WHERE id = ?;`;

    await getTodoItem(id);

    let run = util.promisify(db.run).bind(db);
    await run(sql, [id]);
}

module.exports = {
    initDatabase,
    getAllTodoItems,
    getTodoItem,
    addTodoItem,
    updateTodoItem,
    deleteTodoItem
}
