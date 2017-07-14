/**
 *
 */
const expect = require('chai').expect;
const config = require('../fixtures/testLogProperties.json');
const logLevels = require('../../lib/conf/logLevels.json');
const TestLogger = require('../fixtures/TestLogger');


/*
 Black        0;30     Dark Gray     1;30
 Red          0;31     Light Red     1;31
 Green        0;32     Light Green   1;32
 Brown/Orange 0;33     Yellow        1;33
 Blue         0;34     Light Blue    1;34
 Purple       0;35     Light Purple  1;35
 Cyan         0;36     Light Cyan    1;36
 Light Gray   0;37     White         1;37
 */


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

    describe('fixArguments', () => {
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


});
