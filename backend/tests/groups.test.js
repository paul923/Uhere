const request = require('supertest')
const app = require('../index')

describe('Group Endpoints', () => {
  // Create Test Data
  it('should create a new group', async () => {
    const res = await request(app)
      .post('/groups')
      .send(
        {
          "group" : {
            "UserId" : "O1BDrdaufPcrbKaKt4v1w8Bz0Zl1",
            "GroupName" : "Testing Start"
          },
          "members": [
            {
              "UserId": "eIsb3yMPlScSy5QAtpnqfqzON8r1"
            },
            {
              "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
            },
            {
              "UserId": "abcdefg12345"
            }
          ]
        }
      )
    expect(res.statusCode).toEqual(201)
  })

  //GET
  it('should retrieves a group with valid groupId', async () => {
    const res = await request(app)
      .get('/groups/22')
      .send()
    expect(res.statusCode).toEqual(200)
  })
  it('should return an error with invalid parameter', async () => {
    const res = await request(app)
      .get('/groups/INVALID_PARAMETER')
      .send()
    expect(res.statusCode).toEqual(500)
  })
  it('should return an error if group does not exist', async () => {
    const res = await request(app)
      .get('/groups/9999')
      .send()
    expect(res.statusCode).toEqual(404)
  })
  it("should return an error if group IsDeleted = 1", async () => {
    const res = await request(app)
      .get('/groups/18')
      .send()
    expect(res.statusCode).toEqual(404)
  })

  //PATCH
  it('should return an error if group does not exist', async () => {
    const res = await request(app)
      .patch('/groups/9999')
      .send(
        {
          "groupName" : "GroupName Test",
          "groupMembers" : [
            {
              "UserId": "eIsb3yMPlScSy5QAtpnqfqzON8r1"
            },
            {
              "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
            }
          ]
        }
      )
    expect(res.statusCode).toEqual(404)
  })
  //PATCH
  it('should update only groupname', async () => {
    const res = await request(app)
      .patch("/groups/25")
      .send(
        {
          "groupName" : "GroupName Test",
          "groupMembers" : [
            {
              "UserId": "eIsb3yMPlScSy5QAtpnqfqzON8r1"
            },
            {
              "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
            },
            {
              "UserId": "abcdefg12345"
            }
          ]
        }
      )
    expect(res.statusCode).toEqual(200)
  })
  it('should update by inserting members to an empty group', async () => {
    const res = await request(app)
      .patch("/groups/26")
      .send(
        {
          "groupName" : "GroupName Test",
          "groupMembers" : [
            {
              "UserId": "eIsb3yMPlScSy5QAtpnqfqzON8r1"
            },
            {
              "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
            },
            {
              "UserId": "abcdefg12345"
            }
          ]
        }
      )
    expect(res.statusCode).toEqual(200)
  })
  it('should delete, add, and restore members to and from the group', async () => {
    const res = await request(app)
      .patch("/groups/22")
      .send(
        {
          "groupName" : "GroupName Test change",
          "groupMembers" : [
            {
              "UserId": "eIsb3yMPlScSy5QAtpnqfqzON8r1"
            },
            {
              "UserId": "xltCuDt5quTdCTCKtJbkGOuB3Co2"
            }
          ]
        }
      )
    expect(res.statusCode).toEqual(200)
  })

  //DELETE

  it("should delete a group", async () => {
    const res = await request(app)
      .delete('/groups/10')
      .send()
    expect(res.statusCode).toEqual(204)
  })
  it("should return an error if group does not exist", async () => {
    const res = await request(app)
      .delete('/groups/99999')
      .send()
    expect(res.statusCode).toEqual(404)
  })
})