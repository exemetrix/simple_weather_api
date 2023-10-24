import pgPromise from 'pg-promise';
const pgp = pgPromise({
    capSQL: true
});
const db_connection = pgp({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});
export default {
    db: db_connection,
    helpers: pgp.helpers
};
//# sourceMappingURL=db.js.map