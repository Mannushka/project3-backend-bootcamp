const BaseController = require("./baseController");
class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  async postNewUser(req, res) {
    const { first_name, last_name, email } = req.body;
    try {
      const newUser = await this.model.create({
        first_name,
        last_name,
        email,
      });
      return res.json(newUser);
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async updateUser(req, res) {
    const { userId } = req.params;
    const { first_name, last_name, phone_number, email } = req.body;
    try {
      const userToBeUpdated = await this.model.findByPk(userId);

      const updatedUser = await userToBeUpdated.update({
        first_name,
        last_name,
        phone_number,
        email,
      });

      res.send(updatedUser);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
}
module.exports = UsersController;
