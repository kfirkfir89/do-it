import request from 'supertest';
import { UserWithId, Users } from './users.models';
import app from '../../app';

beforeAll(async () => {
  try {
    await Users.drop();
  } catch (error) {
    console.log('error:', error);
  }
});

let user: UserWithId;

describe('POST /register', () => {
  it('responds with an Zod error', (done) => {
    request(app)
      .post('/register')
      .set('Accept', 'application/json')
      .send({
        displayName: '',
        email: '',
        password: '',
      })
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds sucsseded registeration', (done) => {
    request(app)
      .post('/register')
      .set('Accept', 'application/json')
      .send({
        displayName: 'kfirkfir898989',
        email: 'kfirkfir@gmail.com',
        password: 'kfir123232',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('password');
        user = response.body;
        done();
      });
  });
});

describe('POST /login', () => {
  it('responds with an user wrond info', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ email: 'fds@gfdss.com', password: 'fdsaf35432' })
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with an Zod error', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ email: 'fds@gfdss', password: 'fds2' })
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with an user login data', (done) => {
    request(app)
      .post('/login')
      .set('Accept', 'application/json')
      .send({ email: user.email, password: user.password })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('displayName');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('password');
        done();
      });
  });
});

describe('PUT /update-user-data', () => {
  it('responds with an Zod error', (done) => {
    request(app)
      .put('/update-user-data')
      .set('Accept', 'application/json')
      .send({
        _id: 'gfdsgfd',
        displayName: 'fds',
        email: 'gfds@gds.com',
        password: '123123',
      })
      .expect('Content-Type', /json/)
      .expect(422, done);
  });
  it('responds with an NotFound error', (done) => {
    request(app)
      .put('/update-user-data')
      .send({
        _id: '64be6e52244afefd1462b77c',
        displayName: 'fdsfgdsa',
        email: 'gfds@gds.com',
        password: '1231233gfds',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, done);
  });
  it('responds with a updated user data', (done) => {
    request(app)
      .put('/update-user-data')
      .set('Accept', 'application/json')
      .send({
        _id: user._id.toString(),
        displayName: 'fdsfgds21312a',
        email: user.email,
        password: user.password,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('_id');
        expect(response.body._id).toBe(user._id);
        expect(response.body).toHaveProperty('displayName');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('password');
        done();
      });
  });
});
