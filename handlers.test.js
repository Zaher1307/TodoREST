const axios = require('axios');

let obj1 = {
    todoItem: 'play',
    complete: 0
};

let obj2 = {
    todoItem: 'study',
    complete: 0
};

let modObj1 = {
    id: 1,
    todoItem: 'modified',
    complete: 0
};

let url = 'http://localhost:8000/todolist';

beforeAll(async () => {
    await axios.post(url, obj1);
    await axios.post(url, obj2);
    obj1.id = 1;
    obj2.id = 2;
});

test('get request and post request handlers', async () => {
    let res1 = await axios.get(url)
    let res2 = await axios.get(url + '/1')
    let res3 = await axios.get(url + '/2')
    expect(res1.data).toStrictEqual([obj1, obj2]);
    expect(res2.data).toStrictEqual(obj1);
    expect(res3.data).toStrictEqual(obj2);
});

test('patch request handler', async () => {
    let res = await axios.patch(url, modObj1);
    expect(res.data).toStrictEqual(modObj1);
});

test('test delete request handler', async () => {
    await axios.delete(url + '/1');
    await axios.delete(url + '/2');
    let res = await axios.get(url);
    expect(res.data).toStrictEqual([]);
});
