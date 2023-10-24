var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class LocationModel {
    constructor(db, db_helpers) {
        this.db = db;
        this.db_helpers = db_helpers;
    }
    ;
    getLocation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM locations WHERE id = $1;`;
            const result = yield this.db.oneOrNone(query, [id]).catch(e => console.error(e));
            return !result ? undefined : result;
        });
    }
    getLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM locations`;
            const result = (yield this.db.manyOrNone(query).catch(e => console.error(e)));
            return !result ? undefined : result;
        });
    }
    updateLocation(id, latitude, longitude, name, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = {
                latitude: latitude,
                longitude: longitude,
                name: name,
                slug: slug
            };
            const columnSet = new this.db_helpers.ColumnSet(['latitude, longitude, name, slug'], { table: 'location' });
            const query = this.db_helpers.update(insertData, columnSet) + "WHERE id = $1";
            const result = yield this.db.result(query, [id]).catch(e => console.error(e));
            return !result ? undefined : result.rowCount > 0;
        });
    }
}
//# sourceMappingURL=location.js.map