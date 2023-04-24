const chai = require('chai');
const assert = chai.assert;
const testCases = require('../testCases.json');


const Translator = require('../components/translator.js');

suite('Unit Tests', () => {


    testCases.forEach((testCase) => { 
        test('Test Case: ' + testCase.input, () => {
        let input = testCase.input;
        let direction = testCase.direction;
        let translator = new Translator(input, direction);
        let outputFromFile = testCase.output;
        let outputTranslated = translator.centralBrain().translation;
        assert.equal(outputTranslated, outputFromFile);
        
        });
    });
});
