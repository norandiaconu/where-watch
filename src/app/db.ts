import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
    name: 'where-watch',
    version: 1,
    objectStoresMeta: [
        {
            store: 'login',
            storeConfig: {
                keyPath: 'id',
                autoIncrement: false
            },
            storeSchema: [
                {
                    name: 'token',
                    keypath: 'token',
                    options: {
                        unique: false
                    }
                }
            ]
        }
    ]
};
