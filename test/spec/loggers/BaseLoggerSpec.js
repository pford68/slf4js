/**
 *
 */
const expect = require('chai').expect;
const config = require('../../fixtures/testLogProperties.json');
const logger = require('../../../lib/loggers/BaseLogger');
const Logger = require('../../../lib/loggers/Logger');

describe('BaseLogger', () => {

    it('should implement Logger', () => {
        Object.keys(Logger.prototype).forEach( name => {
            if (Logger.prototype.hasOwnProperty(name)){
                expect(logger[name]).to.be.a('function');
            }
        });
    })
});
