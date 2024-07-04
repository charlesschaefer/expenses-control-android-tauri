import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";

export const dbConfig: DBConfig = {
    name: 'expense-control',
    version: 1,
    objectStoresMeta: [
        {
            store: 'category',
            storeConfig: { keyPath: 'id', autoIncrement: true},
            storeSchema: [
                { name: 'name', keypath: 'name', options: { unique: false }}
            ]
        },
        {
            store: 'account',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'name', keypath: 'name', options: { unique: false }}
            ]
        },
        {
            store: 'expense',
            storeConfig: { keyPath: 'id', autoIncrement: true },
            storeSchema: [
                { name: 'category', keypath: 'category', options: { unique: false }},
                { name: 'account', keypath: 'account', options: { unique: false }},
                { name: 'value', keypath: 'value', options: { unique: false }},
                { name: 'date', keypath: 'date', options: { unique: false }},
                { name: 'type', keypath: 'type', options: { unique: false }},
            ]
        }
    ]
};