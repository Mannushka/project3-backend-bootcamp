const BaseController = require('./baseController');

class CategoriesController extends BaseController {
  constructor(model, productModel) {
    super(model);
    this.productModel = productModel;
  }

  async getOne(req, res) {
    const { categoryId } = req.params;

    try {
      const category = await this.model.findByPk(categoryId);

      res.send(category);
    } catch (err) {
      res.status(400).json({ error: true, msg: err });
    }
  }

  async postOne(req, res) {
    const { name } = req.body;

    try {
      const newCategory = await this.model.create({
        name: name,
      });

      res.send(newCategory);
    } catch (err) {
      res.status(400).json({ error: true, msg: err });
    }
  }

  async updateOne(req, res) {
    const { categoryId } = req.params;

    const { name } = req.body;

    try {
      const categoryToBeUpdated = await this.model.findByPk(categoryId);

      const updatedCategory = await categoryToBeUpdated.update({
        name: name,
      });

      res.send(updatedCategory);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async deleteOne(req, res) {
    const { categoryId } = req.params;

    try {
      await this.model.destroy({
        where: {
          id: categoryId,
        },
      });

      res.send('Category has been deleted!');
    } catch (err) {
      res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = CategoriesController;
