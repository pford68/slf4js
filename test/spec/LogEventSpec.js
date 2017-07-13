/**
 *
 */
const chai = require('chai');
const expect = chai.expect;
const LogEvent = require('../../lib/LogEvent');

describe('LogEvent', () => {

    it ('should have a datetime property that is a Date object', () => {
        const event = new LogEvent(null, { name: 'LOG'}, 'Hi!');
        expect(event.datetime).to.be.a('Date');
    });

    it ('should sve string messages in the data property, leaving the message property blank', () => {
        let message = 'Hi!';
        const event = new LogEvent(null, { name: 'LOG'}, message);
        expect(event.message).to.be.a('String');
        expect(event.message.length).to.equal(0);
        expect(event.data).to.equal(message);
    });

    it ('should sve Object messages in the message property, and data shold be null', () => {
        let message = { content: 'Hi!' };
        const event = new LogEvent(null, { name: 'LOG'}, message);
        expect(event.message.content).to.equal(message.content);
        expect(event.data).to.be.null;
    });

});