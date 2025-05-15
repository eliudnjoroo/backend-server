const Category = require("../connection.js").categoryColl;

const create_new_category = (req, res) => {
  const { category } = req.params
  const categ = new Category({
    category_name: category
  })
  categ.save()
    .then(() => {
      res.json({ success: "true", message: "category saved" });
    })
    .catch(err => res.json({ success: "false", message: "category not saved", fatError: err }));
}

const delete_old_category = (req, res) => {
  const { category } = req.params
  Category.findOneAndDelete({ category_name: category })
    .then(() => {
      res.json({ success: "true", message: "category deleted" });
    })
    .catch(err => res.json({ success: "false", message: "category not deleted", fatError: err }));
}

const update_old_category = (req, res) => {
  const { old_category, new_category } = req.params
  Category.findOneAndUpdate({ category_name: old_category },
    { category_name: new_category },
    { new: true })
    .then(() => {
      res.json({ success: "true", message: "category updated", old_name: `${old_category}`, new_name: `${new_category}` });
    })
    .catch(err => res.json({ success: "false", message: "category not updated", fatError: err }));
}

const find_all_category = (req, res) => {
  Category.find({})
    .then(( all_data ) => {
      res.json({ success: "true", message: "all category fetched", data: all_data });
    })
    .catch(err => res.json({ success: "false", message: "category not updated", fatError: err }));
}

module.exports = { create_new_category, delete_old_category, update_old_category, find_all_category }