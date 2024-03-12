import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email } = req.body;
    const { password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }

    const users = dbClient.db.collection('users');
    await users.findOne({ email }, (err, result) => {
      if (result) {
        res.status(400).json({ error: 'Already exist' });
      } else {
        const hashedPwd = sha1(password);
        users.insertOne({ email, password: hashedPwd }).then((user) => {
          res.status(201).json({ id: user.insertedId, email });
        });
      }
    });
  }

module.exports = UsersController;
