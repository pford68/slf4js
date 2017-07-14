/**
 *
 */
const expect = require('chai').expect;
const config = require('../fixtures/testLogProperties.json');
const logLevels = require('../../lib/conf/logLevels.json');
const TestLogger = require('../fixtures/TestLogger');


describe('LogUtils', () => {

    let utils = require('../../lib/LogUtils')(config);

    describe('getLogLevel()', () => {
        it('should return the log level configured for the logger\s subject, ' +
            'whether the subject is a class or a function', () => {
            let logger = new TestLogger();
            logger.subject = 'MyGreatClass';
            expect(utils.getLogLevel(logger)).to.equal(logLevels.LOG);
            logger = new TestLogger()
            logger.subject = 'firstModule';
            expect(utils.getLogLevel(logger)).to.equal(logLevels.INFO);
        });

        it('should return logLevel property, once it is set, instead of looking it up again (caching)', () => {
            let logger = new TestLogger();
            logger.subject = 'MyGreatClass';
            logger.logLevel = logLevels.ERROR;
            expect(utils.getLogLevel(logger)).to.equal(logLevels.ERROR);
        });
    });

    describe('findConfig()', () => {
        it('should successfully find the subject in the configuration', () => {
            let args = require('../../lib/LogUtils')({
                'a': 'ERROR',
                'b': 'FUN',
                'c': 'WHAT?'
            });
            let logger = new TestLogger();
            logger.subject = 'b';
            expect(args.findConfig('b')).to.equal('FUN');
            expect(args.findConfig('c')).to.equal('WHAT?');
        });

        it('should work with subjects that are object paths', () => {
            let args = require('../../lib/LogUtils')({
                'a.e.f': 'OK',
                'b': 'NO',
                'b.c': 'YES',
                'c.d.e.f.g': 'wait!',
                'c.d.e.f.g.h.i.j': 'WHAT?'
            });
            let logger = new TestLogger();
            logger.subject = 'b';
            expect(args.findConfig('a.e.f')).to.equal('OK');
            expect(args.findConfig('b')).to.equal('NO');
            expect(args.findConfig('b.c')).to.equal('YES');
            expect(args.findConfig('c.d.e.f.g')).to.equal('wait!');
            expect(args.findConfig('c.d.e.f.g.h.i.j')).to.equal('WHAT?');
        });
    });

    describe('formatArguments()', () => {
        it('should return a String', () => {
            let logger = new TestLogger();
            logger.logEvent = { data: 'hgfhhgfh'};
            expect(utils.formatArguments(logger, 'a', [1,2,3], { msg: 'OK' })).to.be.a('String');
        });

        it('should stringify objects', () => {
            let logger = new TestLogger();
            logger.subject = 'MyGreatClass';
            logger.logEvent = { data: 'hgfhhgfh', message: '' };
            let result = utils.formatArguments(logger, 'a', [1,2,3], { msg: 'OK' });
            expect(result).to.have.string(JSON.stringify({ msg: 'OK' }));
            expect(result).to.have.string('[1,2,3]');
        });
    });


    describe('toArray()', () => {
        it('should simply return the same array when an array is passed to it', () => {
            let a = [1,2,3,4];
            let b = utils.toArray(a);
            expect(Object.is(a, b)).to.be.true;
        });

        it('should return a comma-separated string as an array of trimmed strings', () => {
            let b = utils.toArray('a, fine, what?,12,OK,  nice,b  ');
            expect(Array.isArray(b)).to.be.true;
            expect(b.length).to.equal(7);
            expect(b[0]).to.equal('a');
            expect(b[1]).to.equal('fine');
            expect(b[2]).to.equal('what?');
            expect(b[3]).to.equal('12');
            expect(b[4]).to.equal('OK');
            expect(b[5]).to.equal('nice');
            expect(b[6]).to.equal('b');
        });

        it('should return a string with no commas as an array with one element', () => {
            let b = utils.toArray('OK');
            expect(Array.isArray(b)).to.be.true;
            expect(b.length).to.equal(1);
            expect(b[0]).to.equal('OK');
        });
    });


});
