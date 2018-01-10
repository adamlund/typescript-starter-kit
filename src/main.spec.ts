import { Main } from './main';

/**
 * Add your tests to this folder
 * run tests with > npm run test
 */
describe(`Main App`, () => {

    let main: Main;

    beforeEach(() => {
        main = new Main();
    });

    it('should construct', () => {
        expect(main).toBeDefined();
    });
});
