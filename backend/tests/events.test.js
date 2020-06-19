const request = require('supertest')
const app = require('../index')

describe('Event Endpoints', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        "event": {
          "Name": "API Test",
          "Description": "API Test Description",
          "LocationName": "API Tester",
          "LocationAddress": "API Tester",
          "LocationGeolat": 0,
          "LocationGeolong": 0,
          "DateTime": 1592522215542,
          "MaxMember": 3,
          "Penalty": "americano"
        },
        "host": "eIsb3yMPlScSy5QAtpnqfqzON8r1",
        "users": [
          {
            "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
          },
          {
            "UserId": "O1BDrdaufPcrbKaKt4v1w8Bz0Zl1"
          }
        ]
      })
    expect(res.statusCode).toEqual(201)
  })
  it('retrieve events', async () => {
    const res = await request(app)
      .get('/events?acceptStatus=ACCEPTED&history=true&userId=eIsb3yMPlScSy5QAtpnqfqzON8r1&offset=0&limit=20')
      .send()
    expect(res.statusCode).toEqual(200)
  })
  it('fail to retrieves events due to missing parameters', async () => {
    const res = await request(app)
      .get('/events')
      .send()
    expect(res.statusCode).toEqual(400)
  })
  it('retrieve one event', async () => {
    const res = await request(app)
      .get('/events/69')
      .send()
    expect(res.statusCode).toEqual(200)
  })
  it('fail to retrieve event with invalid id', async () => {
    const res = await request(app)
      .get('/events/2000')
      .send()
    expect(res.statusCode).toEqual(404)
  })
  it('accept event', async () => {
    const res = await request(app)
      .patch('/events/109/users/O1BDrdaufPcrbKaKt4v1w8Bz0Zl1')
      .send({
        "status": "ACCEPTED"
      })
    expect(res.statusCode).toEqual(200)
  })
  it('decline event', async () => {
    const res = await request(app)
      .patch('/events/109/users/O1BDrdaufPcrbKaKt4v1w8Bz0Zl1')
      .send({
        "status": "DECLINED"
      })
    expect(res.statusCode).toEqual(200)
  })
  it('fail to accept event without status', async () => {
    const res = await request(app)
      .patch('/events/109/users/O1BDrdaufPcrbKaKt4v1w8Bz0Zl1')
      .send()
    expect(res.statusCode).toEqual(400)
  })
  it('fail to accept event with wrong status value', async () => {
    const res = await request(app)
      .patch('/events/109/users/O1BDrdaufPcrbKaKt4v1w8Bz0Zl1')
      .send({
        "status": "DECLINED123"
      })
    expect(res.statusCode).toEqual(400)
  })
  it('delete one event', async () => {
    const res = await request(app)
      .delete('/events/108')
      .send()
    expect(res.statusCode).toEqual(204)
  })
  it('fail to delete event with invalid id', async () => {
    const res = await request(app)
      .delete('/events/200')
      .send()
    expect(res.statusCode).toEqual(404)
  })
})
