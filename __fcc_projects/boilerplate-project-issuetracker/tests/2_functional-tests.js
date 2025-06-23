const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let id;

suite('Functional Tests', function () {

  this.timeout(5000)

  //1
  test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
    chai.request(server)
      .post(`/api/issues/apitest`)
      .send({
        issue_title: ' 1 ',
        issue_text: '2',
        created_by: '3',
        assigned_to: '4',
        status_text: '5'
      }
      )
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).issue_title, "1")
        assert.equal(JSON.parse(res.text).issue_text, "2")
        assert.equal(JSON.parse(res.text).created_by, "3")
        assert.equal(JSON.parse(res.text).assigned_to, "4")
        assert.equal(JSON.parse(res.text).status_text, "5")
        done()
      })
  })

  //2
  test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
    chai.request(server)
      .post(`/api/issues/apitest`)
      .send({
        issue_title: ' 1 ',
        issue_text: '2',
        created_by: '3'
      }
      )
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).issue_title, "1")
        assert.equal(JSON.parse(res.text).issue_text, "2")
        assert.equal(JSON.parse(res.text).created_by, "3")
        assert.equal(JSON.parse(res.text).assigned_to, "")
        assert.equal(JSON.parse(res.text).status_text, "")
        done()
      })
  })

  //3
  test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
    chai.request(server)
      .post(`/api/issues/apitest`)
      .send({})
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).error, "required field(s) missing")
        done()
      })
  })

  //4
  test("View issues on a project: GET request to /api/issues/{project}", (done) => {
    chai.request(server)
      .get(`/api/issues/apitest`)
      .end((req, res) => {
        assert.equal(res.status, 200);
        id = JSON.parse(res.text)[0]._id
        assert.equal(JSON.parse(res.text)[0].issue_title, "1")
        assert.equal(JSON.parse(res.text)[0].issue_text, "2")
        assert.equal(JSON.parse(res.text)[0].created_by, "3")
        assert.equal(JSON.parse(res.text)[0].assigned_to, "4")
        assert.equal(JSON.parse(res.text)[0].status_text, "5")
        done()
      })
  })

  //5
  test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
    chai.request(server)
      .get(`/api/issues/apitest?issue_title=1`)
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text)[0].issue_title, "1")
        assert.equal(JSON.parse(res.text)[0].issue_text, "2")
        assert.equal(JSON.parse(res.text)[0].created_by, "3")
        assert.equal(JSON.parse(res.text)[0].assigned_to, "4")
        assert.equal(JSON.parse(res.text)[0].status_text, "5")
        done()
      })
  })

  //6
  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", (done) => {
    chai.request(server)
      .get(`/api/issues/apitest?issue_title=1&issue_text=2&created_by=3&assigned_to=4&status_text=5`)
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text)[0].issue_title, "1")
        assert.equal(JSON.parse(res.text)[0].issue_text, "2")
        assert.equal(JSON.parse(res.text)[0].created_by, "3")
        assert.equal(JSON.parse(res.text)[0].assigned_to, "4")
        assert.equal(JSON.parse(res.text)[0].status_text, "5")
        done()
      })
  })

  //7
  test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
    chai.request(server)
      .put(`/api/issues/apitest`)
      .send({
        _id: id,
        issue_title: ' 6 '
      })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).result, "successfully updated")
        done()
      })
  })

  //8
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
    chai.request(server)
      .put(`/api/issues/apitest`)
      .send({
        _id: id,
        issue_title: ' 6 ',
        issue_text: '7',
        created_by: '8',
        assigned_to: '9',
        status_text: '10',
        open: false
      })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).result, "successfully updated")
        done()
      })
  })

  //9
  test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
    chai.request(server)
      .put(`/api/issues/apitest`)
      .send({
        open: false
      })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).error, "missing _id")
        done()
      })
  })

  //10
  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
    chai.request(server)
      .put(`/api/issues/apitest`)
      .send({
        _id: id
      })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).error, "no update field(s) sent")
        done()
      })
  })

  //11
  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
    chai.request(server)
      .put(`/api/issues/apitest`)
      .send({
        _id: "uyiyugt6765uyguygu7657",
        issue_title: ' 6 '
      })
      .end((req, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).error, "could not update")
        done()
      })
  })

  //12
  test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
    chai.request(server)
      .delete("/api/issues/apitest")
      .send({ _id: id })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).result, "successfully deleted")
        done()
      })
  })

  //13
  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
    chai.request(server)
      .delete("/api/issues/apitest")
      .send({ _id: id })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).error, "could not delete")
        done()
      })
  })

  //14
  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
    chai.request(server)
      .delete("/api/issues/apitest")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(JSON.parse(res.text).error, "missing _id")
        done()
      })
  })

});
