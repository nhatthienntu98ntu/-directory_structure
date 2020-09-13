import * as NodeCache from 'node-cache';
import { CommonResponse } from './../helper/commonResponse';

const commonResponse: CommonResponse = new CommonResponse();

export class CacheMiddleWare {
    private cache: NodeCache;

    constructor(ttlSecond: number) {
        this.cache = new NodeCache({
            stdTTL: ttlSecond,
            checkperiod: ttlSecond * 0.2,
            useClones: false,
        });
    }

    getByKey(key) {
        const value = this.cache.get(key);
        if (value) {
            return value;
        }
        return null;
    }

    get = async (key, res, storeFunction) => {
        console.log('keys: ', this.cache.keys());
        const values = this.cache.get(key);
        if (values) {
            commonResponse.successResponse(res, values);
        } else {
            await storeFunction().then(results => {
                this.cache.set(key, results);
                commonResponse.successResponse(res, results);
            });
        }
    };

    getAllKey() {
        return this.cache.keys();
    }

    del(keys: string) {
        console.log('before del keys: ', this.cache.keys());
        this.cache.del(keys);
        console.log('after del keys: ', this.cache.keys());
    }

    delKeyHasId(keyId: string) {
        if (keyId === '') {
            return;
        }

        const keys = this.cache.keys();
        console.log('all keys before delete: ', keys);

        for (const key of keys) {
            if (key.indexOf(keyId) !== -1) {
                this.del(key);
            }
        }

        console.log('all keys after delete: ', this.cache.keys());
    }

    delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    flush() {
        console.log('all keys before flush: ', this.cache.keys());
        this.cache.flushAll();
        console.log('all keys after flush: ', this.cache.keys());
    }
}
