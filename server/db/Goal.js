const makeUuid = require('uuid/v4');
const Account = require('./Account');
const { desnakeify, pickFirst, snakeify } = require('../lib');

class Goal {
  constructor(conn) {
    this.conn = conn;
    this.account = new Account(conn);
  }

  async createGoal(accountId, goal) {
    const startingBalance = await this.account.calculateCurrentBalance(
      accountId,
    );

    return desnakeify(
      pickFirst(
        this.conn('goals').insert(
          snakeify({ id: makeUuid(), accountId, startingBalance, ...goal }),
          '*',
        ),
      ),
    );
  }

  fetchGoals() {
    return desnakeify(
      this.conn('goals')
        .select('*')
        .orderBy('due_date', 'ASC'),
    );
  }
}

module.exports = Goal;
