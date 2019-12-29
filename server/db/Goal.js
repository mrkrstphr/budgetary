const { desnakeify } = require('../lib');

class Goal {
  constructor(conn) {
    this.conn = conn;
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
