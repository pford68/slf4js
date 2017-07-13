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

    it('should contain getLogger()', () => {
        expect(typeof slf4js.getLogger === 'function').to.be.true;
    });

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


        it('should accept functions as input, as well as strings', () => {
            function testFunction(){}
            let LOGGER = slf4js.getLogger(testFunction);
            expect(typeof LOGGER.info === 'function').to.be.true;
        });


        it('should not throw an error if the function is anonymous', () => {
            let f = function(){
                let LOGGER = slf4js.getLogger(this);
                LOGGER.log("It works");
            };
            try {
                f();
            } catch(e){
                expect.fail(0, 1, "We should not reach this point.")
            }
        });


        it('should accept classes as input', () => {
            class MyGreatClass {}
            let LOGGER = slf4js.getLogger(MyGreatClass);
            expect(typeof LOGGER.info === 'function').to.be.true;
            expect(typeof LOGGER.info === 'function').to.be.true;
        });


        describe('The returned Logger', () => {
            it('should be frozen', () => {
                expect(LOGGER).to.be.frozen;
            });
            it('should not be extensible', () => {
                expect(LOGGER).not.to.be.extensible;
            });
        });



    });

});

