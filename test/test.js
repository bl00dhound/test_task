const { assert } = require('chai');
const crypto = require('crypto');
const request = require('supertest')('http://localhost:9009');

const hash = crypto.createHash('md5').update('' + Math.random() + Date.now()).digest('hex');
let email = 'test_' + hash + '@smartyads.com';
let password = 'test'
let name = 'test_name'

// add variable _user for passing test
const _user = {
    email: email,
    password: password,
    name: name
};
const user_id = 0;

describe('Users CRUD', () => {

    it('should add new user end return id', () => {
        return request
            .post('/api/user')
            .send({
                email,
                password,
                name
            })
            .expect(201)
            .then(data => {
                console.log(data)
                user_id = data;
                assert.notEqual(user_id, 0);
            })
    });

    it('should return 400 Bad Request', () =>
        request
            .post('/api/user')
            .send({ email })
            .expect(400)
            .then(() => {
                assert.isOk(true);
            })
    )

    it('should return user by id', () =>
        request()
            .get('/api/user/' + user_id)
            .expect(200)
            .then(data => {
                assert.equal(data.email, _user.email);
                assert.equal(data.name, _user.name);
                assert.equal(data.id, user_id);
            })
    );

    it('should return array of users', () =>
        request()
            .get('/api/user/')
            .expect(200)
            .then(data => {
                assert.isArray(data);
                assert.isOk(data.length > 0);
            })
    );

    it('should change name of user', () => {
        user.email = 'test_' + email;
        return request()
            .put('/api/user/' + user_id)
            .send(user)
            .expect(200)
            .then(updatedUser => {
                const { updatedEmail } = updatedUser;
                assert.deepEqual(updatedEmail, _user.email);
            })
    })

    it('find users by name', () =>
        request()
            .get('/api/user/search/' + hash)
            .expect(200)
            .then(users => {
                assert.isArray(users, 'should be array of finded users');
                assert.include(users[0].email, hash);
            })
    )

    it('should delete user from db', () =>
        request()
            .delete('/api/user/' + user_id)
            .expect(200)
            .then(() =>
                request(app)
                    .get(host + '/' + user_id)
                    .expect(400)
                    .then(() => { assert.isOk(true); })
            )
    )
})