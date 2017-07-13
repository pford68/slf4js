/**
 * Unit tests for slf4js
 */
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const config = require('../fixtures/testLogProperties.json');
const testLogger = require('../fixtures/AlertLogger');
const slf4js = require('../../lib/slf4js')(testLogger, config);
const Decorator = require('../../Decorator');


describe('slf4js', () => {

    describe('getLogger()', () => {
        let LOGGER;

        beforeEach(() => {
            LOGGER = slf4js.getLogger('MyGreatClass');
        });

        afterEach(() => {

        });

        it('should return a valid Logger', () => {
            expect(typeof LOGGER.info === 'function').to.be.true;
            expect(typeof LOGGER.debug === 'function').to.be.true;
            expect(typeof LOGGER.warn === 'function').to.be.true;
            expect(typeof LOGGER.log === 'function').to.be.true;
            expect(typeof LOGGER.error === 'function').to.be.true;
        });


        describe('The returned Logger', () => {
            it('should be frozen', () => {
                expect(Object.isFrozen(LOGGER)).to.be.true;
            });

            it('should not be extensible', () => {
                expect(Object.isExtensible(LOGGER)).to.be.false;
            });
        });



    });

});

