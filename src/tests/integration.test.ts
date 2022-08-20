/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as db from './db';
import * as toursController from '../controllers/toursController';
import { mockRequest, mockResponse } from 'jest-mock-req-res';
import { Request, response, Response } from 'express';
// INTEGRATION TESTING MEANS: 
// - TESTING BLOCKS OF FUNCTIONALITY, LIKE MODULES, THAT HAS DEPENDENCIES.
// The goal of these tests is to check the connectivity and communication between different components of the application.

// without authentication, test things separately

// connect to database
// start app with db
// test routers with db
// test controllers with db
// etc...

// jest.setTimeout(60000);

// function createResponse() {
//     let res = {
//         send: function(){},
//         json: function(d: any) {
//             console.log('\n : ' + d);
//         },
//         status: function(s: any) {
//             this.statusCode = s;
//             return this;
//         },
//         statusCode: null
//     };

//     return res;
// }


// beforeAll(async () => await db.connect());
// afterEach(async () => await db.clear());
// afterAll(async () => await db.close());


describe('Tours', () => {
    describe('Is true,', () => {
        it(' true?', () => {
            expect(true).toBe(true);
        });
    });    
});