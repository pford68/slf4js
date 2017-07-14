/**
 *
 */
const expect = require('chai').expect;
const config = require('../fixtures/testLogProperties.json');
const sinon = require('sinon');
const Decorator = require('../../lib/LoggingDecorator')(config);
const TestLogger = require('../fixtures/TestLogger');

describe('LoggingDecorator', () => {
    
    it ('should not execute logging when the log level is set to OFF', () => {
        let logger =  new TestLogger();
        let decorator = new Decorator(logger, { subject: 'MyGreatClass', logLevel: 'LOG' });
        decorator.debug('OK');
        console.log('gfdgfd', logger.lastMessage());
    });
});
