// END2END TESTING MEANS: 
// TESTING THE WHOLE APPLICATION FROM INPUT TO OUTPUT, INCLUDING "OUTSIDE" DEPENDENCIES LIKE DATABASES. 
// The goal of these tests is to check the connectivity and communication between different components of the application.







// // import supertest from 'supertest';
// // import app from '../utilities/express';
// import mongoose from 'mongoose';

// // const supertest = require('supertest');
// // POST NEW TOUR1
// // POST NEW TOUR2 (WRONG FORMAT)
// // UPDATE TOUR2
// // GET ALL TOURS
// // GET UPDATED TOUR
// // DELETE TOUR

// // const test = supertest(app);

// // const tours = [
// //     {
// //         title: 'Altar of Antwerp',
// //         description: 'A tour of historal Antwerp, with a close look at its Altar',
// //         duration: 120
// //     },
// //     {
// //         title: 'Burning Leuven',
// //         description: 'History of Leuven during World War II',
// //         duration: 90
// //     },
// //     {
// //         title: 123,
// //         description: true,
// //         duration: '120'
// //     },
// // ];

// // console.log(tours[0]);

// // is swagger working?
// describe('Tours', () => {
//     let connected = false;
//     const DB_URI = 'mongodb://andrei:nHZtFji3qPejxVLyzGVJaejX@localhost:27017/testDB?authSource=admin';


//     beforeAll( async() => {
//         mongoose.connect(DB_URI)
//             .then(() => {
//                 // only start listening once connected to db
//                 connected = true;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     });
    
//     afterAll(async() => {
//         await mongoose.disconnect();
//         await mongoose.connection.close();
//     });

//     describe('Connect to DB', () => {
//         it('connection', () => {
//             expect(connected).toBe(true);
//         });
//     });

//     // describe('POST /tours', () => {

//     //     describe('Create a valid tour', () => {
//     //         // const tour; 
//     //     });


//     //     // describe('given xxx', () => {
//     //     //     it('should be yyy', () => {
//     //     //         expect(true).toBe(true);
//     //     //     });
//     //     // });
//     // });

//     // describe('GET /tours', () => {
//     //     describe('Get all tours', () => {
//     //         // it('return 404', async () => {
//     //         //     await supertest(app).get('/api/tours')
//     //         //         .expect(404);
//     //         // });
//     //         // it('return true').toBe(true);
//     //         it('fakeTest', () => {
//     //             expect(true).toBe(true);
//     //         });
//     //     });


//     //     // describe('given xxx', () => {
//     //     //     it('should be yyy', () => {
//     //     //         expect(true).toBe(true);
//     //     //     });
//     //     // });
//     // });
// });