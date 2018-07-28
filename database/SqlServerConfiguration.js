class SqlServerConfiguration {
    constructor(server, database, user, password) {
        super();
        this.server = server;
        this.database = database;
        this.user = user;
        this.password = password;
    }
}

module.exports = SqlServerConfiguration;