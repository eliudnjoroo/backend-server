'use strict';

module.exports = function (app) {

  let projects = []
  let dif = 1010

  app.route("/api/all").get((req, res) => {
    res.json(projects)
  })

  app.route('/api/issues/:project')

    .get((req, res) => {
      console.log("get: " + req.headers.host)
      let projects_filtered = projects;
      projects_filtered = projects.filter(pro => {
        if (pro.project !== req.params.project) return false;
        for (let key in req.query) {
          if (key === 'open') {
            if (String(pro.open) !== req.query.open) return false;
          } else if (pro[key] != req.query[key]) {
            return false;
          }
        }
        return true;
      });
      res.json(projects_filtered)
    })

    .post(function (req, res) {
      console.log("post: " + req.headers.host)
      let generatdid = `${Math.round(Math.random() * 3214)}ersd${Math.round(Math.random() * 3214)}fsd${dif}fdrw${Math.round(Math.random() * 3214)}`;
      dif += 17
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: 'required field(s) missing' })
      }

      let assigned_to = req.body.assigned_to || ""
      let status_text = req.body.status_text || ""
      let open = true
      let _id = generatdid || ""
      let issue_title = req.body.issue_title || ""
      let issue_text = req.body.issue_text || ""
      let created_by = req.body.created_by || ""
      let created_on = new Date().toISOString()
      let updated_on = new Date().toISOString()
      projects.push({
        project: req.params.project,
        assigned_to: String(assigned_to).trim(),
        status_text: String(status_text).trim(),
        open, _id, issue_title: String(issue_title).trim(),
        issue_text: String(issue_text).trim(),
        created_by: String(created_by).trim(),
        created_on, updated_on
      })
      res.json({
        assigned_to: String(assigned_to).trim(),
        status_text: String(status_text).trim(),
        open, _id, issue_title: String(issue_title).trim(),
        issue_text: String(issue_text).trim(),
        created_by: String(created_by).trim(),
        created_on, updated_on
      })
    })

    .put(function (req, res) {
      console.log("put: " + req.headers.host)
      let id = req.body._id;
      console.log("id: " + id + "\nreq.body: " + JSON.stringify(req.body) + "\n")
      if (!id) {
        return res.json({ error: 'missing _id' })
      }

      const keys = Object.keys(req.body).filter(k => k !== '_id');
      if (keys.length === 0) {
        return res.json({ error: 'no update field(s) sent', _id: id });
      }

      let index = projects.findIndex(p => p._id == id);
      if (index === -1) return res.json({ error: "could not update", _id: id });
      let edited = projects[index];

      let assigned_to = req.body.assigned_to || edited.assigned_to
      let status_text = req.body.status_text || edited.status_text
      let open = req.body.open !== undefined ? req.body.open : edited.open;
      let _id = req.body._id
      let issue_title = req.body.issue_title || edited.issue_title
      let issue_text = req.body.issue_text || edited.issue_text
      let created_by = req.body.created_by || edited.created_by
      let created_on = edited.created_on
      let updated_on = new Date().toISOString()
      projects[index] = {
        project: req.params.project || edited.project,
        assigned_to: String(assigned_to).trim(),
        status_text: String(status_text).trim(),
        open, _id, issue_title: String(issue_title).trim(),
        issue_text: String(issue_text).trim(),
        created_by: String(created_by).trim(),
        created_on, updated_on
      }
      res.json({ result: "successfully updated", _id })
    })

    .delete(function (req, res) {
      console.log("delete: " + req.headers.host)
      console.log("id: " + req.body._id + "\nreq.body: " + JSON.stringify(req.body) + "\n")
      if (!req.body._id) return res.json({ error: 'missing _id' })
      let deleted;
      projects = projects.filter((project) => {
        if (project._id == req.body._id) {
          deleted = project
          return;
        }
        return project;
      })
      if (!deleted) {
        return res.json({ error: "could not delete", _id: req.body._id })
      }
      res.json({ result: "successfully deleted", _id: req.body._id })
    });

};
