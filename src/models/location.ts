import type pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
// import { unescape } from 'querystring';

type Location = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  slug: string;
};

export class LocationModel {
  constructor(
    private db: pgPromise.IDatabase<IClient>,
    private db_helpers: pgPromise.IHelpers
  ) {}

  async getLocation(id: number): Promise<Location | undefined> {
    const query = `SELECT * FROM locations WHERE id = $1;`;
    const result = await this.db
      .oneOrNone(query, [id])
      .catch((e) => console.error(e));
    return !result ? undefined : result;
  }

  async getLocations(): Promise<Location[] | undefined> {
    const query = `SELECT * FROM locations`;
    const result = await this.db
      .manyOrNone(query)
      .catch((e) => console.error(e));
    return !result ? undefined : result;
  }

  async updateLocation(
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    slug: string
  ): Promise<boolean | undefined> {
    const insertData = {
      latitude: latitude,
      longitude: longitude,
      name: name,
      slug: slug
    };
    const columnSet = new this.db_helpers.ColumnSet(
      ['latitude, longitude, name, slug'],
      { table: 'location' }
    );
    const query =
      this.db_helpers.update(insertData, columnSet) + 'WHERE id = $1';
    const result = await this.db
      .result(query, [id])
      .catch((e) => console.error(e));
    return !result ? undefined : result.rowCount > 0;
  }
}

// export { }; // Mark this module temporarily as ES Module
