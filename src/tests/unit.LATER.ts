// UNIT TESTING MEANS: 
// - MOCK RESPONSES, WITHOUT DATABASE!!! 
// - TESTING INDIVIDUAL FUNCTIONS, CLASSES, MODULES, SCHEMAS, ETC.
// import tourController from '../controllers/tourController';
import tourModel, {TourDocument, TourInput} from '../models/tourModel';
import { faker } from '@faker-js/faker';
import * as db from './db';

describe('UNIT TESTS', () => {

    beforeEach(async () => await db.connect());
    afterEach(async () => await db.close());
    // afterAll();
    // async () => await db.clear(), 

    test('tourModel: Create Tour', async () => {
        const tourInput: TourInput = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            headerImage: faker.image.image(600,400),
            duration: faker.datatype.number({ min: 30, max: 240 }),
        };
        const tour = new tourModel({ ...tourInput });
        const createdTour = await tour.save();
        expect(createdTour).toBeDefined();
        expect(createdTour.title).toBe(tour.title);
        expect(createdTour.description).toBe(tour.description);
        expect(createdTour.headerImage).toBe(tour.headerImage);
        expect(createdTour.duration).toBe(tour.duration);
    });
      
});