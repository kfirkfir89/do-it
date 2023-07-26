/* eslint-disable no-underscore-dangle */
import request from 'supertest';

import app from '../../app';
import { Todos } from './todo.models';

beforeAll(async () => {
  try {
    await Todos.drop();
  } catch (error) {
    console.log('error:', error);
  }
});

describe('GET /todos', () => {
  it('responds with an array of todos', (done) => {
    request(app)
      .get('/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
        done();
      });
  });
});

let id = '';
describe('POST /todos', () => {
  it('responds with an array if the todo is invalid', (done) => {
    request(app)
      .post('/todos')
      .set('Accept', 'application/json')
      .send({
        content: '',
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response) => {
        expect(response.body).toHaveProperty('message');
        done();
      });
  });
  it('responds with an inserted object', (done) => {
    request(app)
      .post('/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TypeScript Node',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        id = response.body._id;
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Learn TypeScript Node');
        expect(response.body).toHaveProperty('done');
        done();
      });
  });
});

describe('GET /todos/:id', () => {
  it('responds with a single to todo', (done) => {
    request(app)
      .get(`/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Learn TypeScript Node');
        expect(response.body).toHaveProperty('done');
        done();
      });
  });
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .get('/todos/wrongid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with an NotFound error', (done) => {
    request(app)
      .get('/todos/64be6e52244afefd1462b77c')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});

describe('PUT /todos/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .put('/todos/wrongid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with an NotFound error', (done) => {
    request(app)
      .put('/todos/64be6e52244afefd1462b77c')
      .send({
        content: 'Learn TS',
        done: true,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a single to todo', (done) => {
    request(app)
      .put(`/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        content: 'Learn TS',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(id);
        expect(response.body).toHaveProperty('content');
        expect(response.body.content).toBe('Learn TS');
        expect(response.body).toHaveProperty('done');
        expect(response.body.done).toBe(true);
        done();
      });
  });
});

describe('DELETE /todos/:id', () => {
  it('responds with an invalid ObjectId error', (done) => {
    request(app)
      .delete('/todos/wrongid')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with an NotFound error', (done) => {
    request(app)
      .delete('/todos/64be6e52244afefd1462b77c')
      .send({
        content: 'Learn TS',
        done: true,
      })
      .set('Accept', 'application/json')
      .expect(404, done);
  });
  it('responds with a 204 status code', (done) => {
    request(app)
      .delete(`/todos/${id}`)
      .set('Accept', 'application/json')
      .expect(204, done);
  });
  it('responds with an NotFound error', (done) => {
    request(app)
      .get(`/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
});
