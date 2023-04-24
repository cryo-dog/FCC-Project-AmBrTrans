const Translator = require('./components/translator');
const fs = require('fs');

const tests = [
    { input: "Mangoes are my favorite fruit.", output: "", direction: "right" },
    { input: "I ate yogurt for breakfast.", output: "", direction: "right" },
    { input: "We had a party at my friend's condo.", output: "", direction: "right" },
    { input: "Can you toss this in the trashcan for me?", output: "", direction: "right" },
    { input: "The parking lot was full.", output: "", direction: "right" },
    { input: "Like a high tech Rube Goldberg machine.", output: "", direction: "right" },
    { input: "To play hooky means to skip class or work.", output: "", direction: "right" },
    { input: "No Mr. Bond, I expect you to die.", output: "", direction: "right" },
    { input: "Dr. Grosh will see you now.", output: "", direction: "right" },
    { input: "Lunch is at 12:15 today.", output: "", direction: "right" },
    { input: "We watched the footie match for a while.", output: "", direction: "left" },
    { input: "Paracetamol takes up to an hour to work.", output: "", direction: "left" },
    { input: "First, caramelise the onions.", output: "", direction: "left" },
    { input: "I spent the bank holiday at the funfair.", output: "", direction: "left" },
    { input: "I had a bicky then went to the chippy.", output: "", direction: "left" },
    { input: "I've just got bits and bobs in my bum bag.", output: "", direction: "left" },
    { input: "The car boot sale at Boxted Airfield was called off.", output: "", direction: "left" },
    { input: "Have you met Mrs Kalyani?", output: "", direction: "left" },
    { input: "Prof Joyner of King's College, London.", output: "", direction: "left" },
    { input: "Tea time is usually around 4 or 4.30.", output: "", direction: "left" },
    { input: "Mangoes are my favorite fruit.", output: "", direction: "right" },
    { input: "I ate yogurt for breakfast.", output: "", direction: "right" },
    { input: "We watched the footie match for a while.", output: "", direction: "left" },
    { input: "Paracetamol takes up to an hour to work.", output: "", direction: "left" }
  ];

  tests.forEach((testCase) => {
    const translate = new Translator(testCase.input, testCase.direction);
    const result = translate.centralBrain();
    testCase.output = result.translation;
  });

  console.log(tests);


  fs.writeFile('testCases.json', JSON.stringify(tests), err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Tests written to file');
  });
  