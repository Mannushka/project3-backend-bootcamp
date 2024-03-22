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
}
module.exports = UsersController;
