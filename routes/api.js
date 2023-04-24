'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
// Middleware function for logging requests
const requestLogger = (req, res, next) => {
  console.log("---------------------------------------");
  console.log(`Incoming ${req.method} request for ${req.originalUrl}`);
  console.log("Body: ");
  console.log(req.body);
  console.log("Query: ");
  console.log(req.query);
  console.log("Params: ");
  console.log(req.params);
  console.log("---------------------------------------");
  next();
};
// Use the middleware function
app.use(requestLogger);

  app.route('/api/translate')
    .post((req, res) => {
      if (!req.body.hasOwnProperty("text") || !req.body.hasOwnProperty("locale")) {
        console.log("Fields are missing");
        res.json( {error: "Required field(s) missing"});
        return;
      }
      if (!req.body.text) {
        console.log("Fields are missing");
        res.json( {error: "No text to translate"});
        return;
      }
      if (req.body.locale != "american-to-british" && req.body.locale!= "british-to-american") {
        console.log("Locale does not fit");
        res.json( {error: "Invalid value for locale field"});
        return;
      }
      let orgText = req.body.text;
      let locale = req.body.locale; 
      let direction = locale == "american-to-british" ? "right" : "left";
      const translator = new Translator(orgText, direction);    
      const result = translator.centralBrain();
      result.text = orgText;
      let orgTextSmall = orgText.toLowerCase();
      let resultSmall = result.translation.toLowerCase();
      // Either this or you just add it into the code everywhere! They also want that in the translate json...
      console.log(orgText);
      console.log(result.newString);

      if (resultSmall == orgTextSmall) {
        console.log("No change");
        result.translation = "Everything looks good to me!";
      }

      console.log("Done! Sending final resoponse: ", {text: orgText, translation: result.translation});
      res.json({text: orgText, translation: result.translation});
    });
};
