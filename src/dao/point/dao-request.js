/**
 * All preconfigured request
 */
export class DaoRequest {

    static get SELECT() { return "SELECT * FROM" };

    static get ORDER_BY() { return " ORDER BY" };

    static MEASUREMENT(dbName, measurement) { return " " + dbName + ".autogen." + measurement };

    static WHERE(field, value) { return " WHERE " + field + " = '" + value + "'"};

    static ASC(field) { return " " + field + " ASC" };

    static DESC(field) { return " " + field + " DESC" };

}