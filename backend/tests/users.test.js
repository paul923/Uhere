const request = require('supertest')
const app = require('../index')

describe('Users Endpoints', () => {
    // userId
    it('retrieves a user with valid userId', async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2')
            .send()
        expect(res.statusCode).toEqual(200)
    })
    it('fails to retrieve a user with valid userId because isDeleted = 1', async () => {
        const res = await request(app)
            .get('/users/asdfawef1234')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    it('fails to retrieve a user with invalid userId', async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36123')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    // username
    it('retrieves a user with valid Username', async () => {
        const res = await request(app)
            .get('/users/username/jay')
            .send()
        expect(res.statusCode).toEqual(200)
    })
    it('fails to retrieve a user with valid Username because isDeleted = 1', async () => {
        const res = await request(app)
            .get('/users/username/Postman Create')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    it('fails to retrieve a user with invalid Username', async () => {
        const res = await request(app)
            .get('/users/username/abcdefg')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    // groups
    it("retreives groups from valid user", async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/groups')
            .send()
        expect(res.statusCode).toEqual(200)
    })
    it("fails to retreive groups from invalid user", async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e3123/groups')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    it("fails to retreive groups because user does not have any groups", async () => {
        const res = await request(app)
            .get('/users/dKnJbXjjXwg13Bfkb4jBUcwKzGU2/groups')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    // relationships
    it("retreives relationships from valid user", async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships')
            .send()
        expect(res.statusCode).toEqual(200)
    })
    it("fails to retreives relationships because user does not have any relationship", async () => {
        const res = await request(app)
            .get('/users/xltCuDt5quTdCTCKtJbkGOuB3Co2/relationships')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    it("retreives relationships from valid user and username", async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships/paul923')
            .send()
        expect(res.statusCode).toEqual(200)
    })
    it("fails to retreives relationships because user does not have any relationship with chiyy1231", async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships/chiyy1231')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    it("fails to retreives relationships because iphone7 is deleted", async () => {
        const res = await request(app)
            .get('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships/iphone7')
            .send()
        expect(res.statusCode).toEqual(404)
    })
    // post
    it('creates a user', async () => {
        const res = await request(app)
            .post('/users')
            .send(
                {
                    "UserId": "abcdefg12345",
                    "Username":"Jest Create",
                    "Nickname":"nick",
                    "AvatarURI":"jyp",
                    "AvatarColor":"#D47FA6",
                    "RegisteredDate":"2020-04-20 04:13:34"
                }
            )
        expect(res.statusCode).toEqual(201)
    })
    it('fails to create a user due to duplicate userid', async () => {
        const res = await request(app)
            .post('/users')
            .send(
                {
                    "UserId": "MT8zHZzyrsUxLXC50y3TO6e36HS2",
                    "Username":"Jest Create",
                    "Nickname":"nick",
                    "AvatarURI":"jyp",
                    "AvatarColor":"#D47FA6",
                    "RegisteredDate":"2020-04-20 04:13:34"
                }
            )
        expect(res.statusCode).toEqual(500)
    })
    it('fails to create a user due to duplicate username', async () => {
        const res = await request(app)
            .post('/users')
            .send(
                {
                    "UserId": "awb12879843rhgasdf89w3",
                    "Username":"Jest Create",
                    "Nickname":"nick",
                    "AvatarURI":"jyp",
                    "AvatarColor":"#D47FA6",
                    "RegisteredDate":"2020-04-20 04:13:34"
                }
            )
        expect(res.statusCode).toEqual(500)
    })
    it('creates a relationship', async () => {
        const res = await request(app)
            .post('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships/test')
            .send()
        expect(res.statusCode).toEqual(201)
    })
    it('fails to creates a relationship due to existing entry', async () => {
        const res = await request(app)
            .post('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships/test')
            .send()
        expect(res.statusCode).toEqual(500)
    })
    // patch
    it('updates user with valid params', async () => {
        const res = await request(app)
            .patch('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2')
            .send(
                {
                    "Nickname": "aaaabbbbccccdddd",
                    "AvatarURI": "/assets/images/sample.png",
                    "AvatarColor": "#9599B3"
                }
            )
        expect(res.statusCode).toEqual(200)
    })
    it('fails to update a user due to invalid userId', async () => {
        const res = await request(app)
            .patch('/users/MT8zHZzyrsUxLXC50y3TO6e36HS1')
            .send(
                {
                    "Nickname": "aaaabbbbccccdddd",
                    "AvatarURI": "/assets/images/sample.png",
                    "AvatarColor": "#9599B3"
                }
            )
        expect(res.statusCode).toEqual(404)
    })
    it('update relationship', async () => {
        const res = await request(app)
            .patch('/users/MT8zHZzyrsUxLXC50y3TO6e36HS2/relationships/test')
            .send(
                {
                    "Type":"Blocked"
                }
            )
        expect(res.statusCode).toEqual(200)
    })
    it('fails to update relationship due to invalid userid1', async () => {
        const res = await request(app)
            .patch('/users/MT8zHZzyrsUxLXC50y3TO6e36HS1/relationships/test')
            .send(
                {
                    "Type":"Blocked"
                }
            )
        expect(res.statusCode).toEqual(404)
    })
    // delete
    it("deletes a user", async () => {
        const res = await request(app)
            .delete('/users/abcdefg12345')
            .send()
        expect(res.statusCode).toEqual(204)
    })
    it("fails to delete user with an invalid userId", async () => {
        const res = await request(app)
            .delete('/users/xltCuDt5quTdCTCKtJbkGOuB3123')
            .send()
        expect(res.statusCode).toEqual(404)
    })
})