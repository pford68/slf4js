/**
 * Unit test for themes
 */
const expect = require('chai').expect;
const themes = require('../../../lib/conf/themes');

describe("Themes", () => {

    it ('should be an object', () => {
        expect(themes).to.be.an('object');
    });

    it ('should contain themes for each log method', () => {
        ['assert', 'log', 'debug', 'info', 'warn', 'error'].forEach(item => {
           expect(themes[item.toUpperCase()]).to.exist;
        });
    });
});
