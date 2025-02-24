import jwt from "jsonwebtoken";
import User from "../../models/user.js";

class AccountController {
  constructor() {
    this.user = new User();
  }

  /**
   * Create account controller
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */
  async create(req, res) {
    const { username, email, PASSWORD } = req.body || {};

    try {
      // @TODO: verify if username already exists
      console.log("Creating user", username, email);
      const response = await this.user.create(username, email, PASSWORD);

      res.json({
        success: true,
        data: {
          recordIndex: response?.insertId,
        },
      });
      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
      res.end();
    }
  }

  /**
   *  Login Controller
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   */
  async login(req, res) {
    try {
      const { username, PASSWORD } = req.body || {};

      const result = await this.user.verify(username, PASSWORD);

      if (!result?.user_id) {
        return res.json({
          success: false,
          message: "Invalid username or password",
        });
      }

      res.json({
        success: true,
        data: {
          token: jwt.sign({ username: username }, process.env.API_SECRET_KEY, {
            expiresIn: "1d",
          }),
        },
      });
      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
      res.end();
    }
  }

  /**
   * Get user profile
   *
   * @todo Update this to pull from database
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */
  async profile(req, res) {
    try {
      const userInfo = await this.user.get(res.locals.username);

      res.json({
        success: true,
        data: {
          username: res.locals.username,
          fullname: userInfo?.fullname,
        },
      });
      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
    }
  }

  // async withdraw(req, res) {
  //   try {
  //     const { type, amount } = req.body || {};

  //     if (!amount || isNaN(amount)) {
  //       return res.json({
  //         success: false,
  //         message: "Invalid amount",
  //       });
  //     }

  //     console.log(res.locals.username);

  //     const response = await this.user.updateBalance(
  //       res.locals.username,
  //       amount,
  //       type
  //     );

  //     res.json({
  //       success: true,
  //       data: {
  //         message: "Withdrawal successful",
  //         amount: req.params.amount,
  //       },
  //     });
  //     res.end();
  //   } catch (err) {
  //     res.json({
  //       success: false,
  //       message: err.toString(),
  //     });
  //     res.end();
  //   }
  // }

  /**
   * POST amount to deposit or withdraw
   *
   * @todo Update this to pull from database
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns {void}
   *
   */

  async updateBalance(req, res) {
    try {
      const { type, amount } = req.body || {};

      if (!amount || isNaN(amount)) {
        return res.json({
          success: false,
          message: "Invalid amount",
        });
      }

      console.log(res.locals.username);

      const response = await this.user.updateBalance(
        res.locals.username,
        amount,
        type
      );

      res.json({
        success: true,
        data: {
          message:
            type === "deposit" ? "Deposit successful" : "Withdrawal successful",
          amount: req.params.amount,
          insertId: response.results?.insertId,
        },
      });
      res.end();
    } catch (err) {
      res.json({
        success: false,
        message: err.toString(),
      });
      res.end();
    }
  }
}

export default AccountController;
