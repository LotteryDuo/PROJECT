import { connection } from "../core/database.js";
import { encryptPassword } from "../utils/hash.js";

class User {
  constructor() {
    this.db = connection;
  }

  /**
   * Create user profile
   *
   * @param {String} username
   * @param {String} password
   * @param {String} fullname
   *
   * @returns {Object}
   * @throws MySQL2 error
   *
   */
  async create(username, email, password) {
    try {
      const [results] = await connection.execute(
        "INSERT INTO users(username, email, PASSWORD) VALUES (?, ?, ?)",
        [username, email, encryptPassword(password)]
      );

      return results;
    } catch (err) {
      console.error("<error> user.create", err);
      throw err;
    }
  }

  /**
   * Verify if account exists
   *
   * @param {string} username
   * @param {string} password
   * @returns {Object}
   * @throws {Error}
   */
  async verify(username, password) {
    try {
      const [results] = await connection.execute(
        "SELECT user_id, username, fullname FROM users WHERE username = ? AND password = ?",
        [username, encryptPassword(password)]
      );

      return results?.[0];
    } catch (err) {
      console.error("<error> user.verify", err);
      throw err;
    }
  }

  /**
   * Get user's information
   *
   * @param {string} username
   * @returns {Object}
   * @throws {Error}
   *
   */
  async get(username) {
    try {
      const [results] = await connection.execute(
        "SELECT fullname FROM users WHERE username = ?",
        [username]
      );

      return results?.[0];
    } catch (err) {
      console.error("<error> user.getInformation", err);
      throw err;
    }
  }

  async deposit(username, amount) {
    try {
      await connection.beginTransaction();
      const [results] = await connection.execute(
        "UPDATE users SET balance = balance + ? WHERE username = ?",
        [amount, username]
      );

      const [user] = await connection.execute(
        "SELECT user_id FROM users WHERE username = ?",
        [username]
      );

      if (user.length === 0) throw new Error("User not found");

      const userId = user[0].user_id;

      // Insert transaction record
      const [transactionResult] = await connection.execute(
        "INSERT INTO transactions (user_id, TYPE, amount, transaction_date) VALUES (?, 'Deposit', ?, NOW())",
        [userId, amount]
      );

      await connection.commit();

      return {
        results: results,
        transactionResult: transactionResult,
      };
    } catch (err) {
      await connection.rollback();
      console.error("<error> user.deposit", err);
      throw err;
    }
  }

  /**
   * POST amount to deposit or withdraw
   *
   * @param {string} username
   * @returns {Object}
   * @throws {Error}
   *
   */

  async updateBalance(username, amount, type) {
    try {
      await connection.beginTransaction();

      const [user] = await connection.execute(
        "SELECT user_id, balance FROM users WHERE username = ?",
        [username]
      );

      //check if user exists
      if (user.length === 0) throw new Error("User not found");

      const { user_id: userId, balance } = user[0];

      if (type === "withdrawal" && balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Update balance based on transaction type
      const balanceQuery =
        type === "Deposit"
          ? "UPDATE users SET balance = balance + ? WHERE username = ?"
          : "UPDATE users SET balance = balance - ? WHERE username = ?";

      const [results] = await connection.execute(balanceQuery, [
        amount,
        username,
      ]);

      // Insert transaction record
      const [transactionResult] = await connection.execute(
        "INSERT INTO transactions (user_id, TYPE, amount, transaction_date) VALUES (?, ?, ?, NOW())",
        [userId, type, amount]
      );

      await connection.commit();

      console.log(results);

      return {
        results: results,
        transactionResult: transactionResult,
      };
    } catch (err) {
      await connection.rollback();
      console.error(`<error> user.${type}`, err);
      throw err;
    }
  }
}

export default User;
