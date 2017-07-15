/**
 *
 */
const expect = require('chai').expect;
const config = require('../fixtures/testLogProperties.json');
const sinon = require('sinon');
const Decorator = require('../../lib/LoggingDecorator')(config);
const TestLogger = require('../fixtures/TestLogger');
const augment = require('object-util').augment;

describe('LoggingDecorator', () => {

    function run(decorator){
        decorator.debug('Hello, from debug');
        decorator.error('Hello, from error');
        decorator.log('Hello, from log');
        decorator.assert('Hello, from assert');
        decorator.info('Hello, from info');
        decorator.warn('Hello, from warn');
        decorator.trace('Hello, from trace');
    }
    
    it ('should not execute logging when the log level is set to OFF', () => {
        let logger =  new TestLogger();
        let Decorator = require('../../lib/LoggingDecorator')(augment({ MyGreatClass: 'OFF'}, config));
        let decorator = new Decorator(logger, { subject: 'MyGreatClass' });
        run(decorator);

        expect(logger.messages.length).to.equal(0);
    });

    it ('should execute logging greater than or equal to the configured log level', () => {
        let logger =  new TestLogger();
        let Decorator = require('../../lib/LoggingDecorator')(augment({ MyGreatClass: 'ASSERT'}, config));
        let decorator = new Decorator(logger, { subject: 'MyGreatClass' });
        run(decorator);

        expect(logger.messages.length).to.equal(7);  // 7 log calls in run()
    });
});
