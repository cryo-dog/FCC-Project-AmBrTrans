const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

    constructor() {
        this.replacementCollector = new Set();
        this.findNextAndReplaceCounter = 0;
        this.positionObj = {};
    }

    solver (inputString, direction = "right") {
        let newString = this.replaceHandler(inputString, direction);
        this.locationProvider(newString);
        
        console.log("Set is: ",this.replacementCollector);
        console.log("PositionObj is: ",this.positionObj);
        return {newString: newString, positionObj: this.positionObj};
    }

    replaceHandler(inputString, direction) {
        /* central nerve system of the app
        */

       let updatedString = inputString;
       let maxi = 10;
       while ((this.findNextAndReplace(updatedString, direction)) && maxi > 0) {

        updatedString = this.findNextAndReplace(updatedString, direction);

       }



       //console.log(this.replacementCollector);
       this.arrayHandler(updatedString);
       return updatedString;
    }

    findNextAndReplace(inputString, direction) {
        /* (string) => obj {keyword: string, replacement: string, position: number} 
            Goes through every key in the given components file and checks if keyword matches.
            If yes, returns the object with the position, keyword and the replacement (value)
        */
        let replacement = "";
        let orgString = "";
        let newString = "";
        let searchFiles;

        // Initiating all search objects
        if (direction == "right") {
            searchFiles = [americanOnly, americanToBritishSpelling, americanToBritishTitles];
        } else {
            searchFiles = [britishOnly, americanToBritishSpelling, americanToBritishTitles];  
        };

        for (let searchFile of searchFiles) {
            for (let key in searchFile) {

                // Define strings based on type

                if (direction == "right") {    
                    orgString = key;
                    replacement = searchFile[key];
                } else {
                    orgString = searchFile[key];
                    replacement = key;
                }

                inputString = inputString.toLowerCase();
                if (inputString.includes(orgString)) {
                     
                    if (searchFile == americanToBritishTitles) replacement = this.titleCapitalizer(replacement);

                    newString = this.replaceString(inputString, key, replacement); 


                    // Add the new string value pair to the collection of changes made
                    this.replacementCollector.add(replacement); 

                
                    // return the new string
                    return newString;
                }
            }
        }

        return false; // no match found
    }

    replaceString(inputString, keyword, replacement) {
        /*  (string, string, string) => string
            Replaces the keyword in the inputString with the replacement and adds it to the replacementCollector array => check if you can use a collection

        */
        let stringLocations = this.locationProvider(inputString, keyword);
        let keywordLength = keyword.length;

        for (let location in stringLocations) {
            console.log(location);
        }

       return inputString.replace(keyword, replacement); // Does not work because it replaces wrong parts!
    }


    locationProvider(inputString, inputArray = this.replacementCollector) {
        inputString = inputString.toLowerCase();
        const returnerObj = {};


        for (let keyword of inputArray) {
            let startIndex = 0;
            let foundPos = 0;

            while (startIndex < inputString.length) {
                keyword = keyword.toLowerCase();
                foundPos = inputString.indexOf(keyword, startIndex);
                if (foundPos < 0) break;
                returnerObj[foundPos] = keyword;
                startIndex = foundPos + 1;
            }
        }
        return returnerObj;
    }

    arrayHandler(inputArray) {
        /* Adds to the starting, ending positions of changes in final string
         ({start: 1, end: 3, length: 5}, ...)

         ReplacementCollector: [{keyword: string, replacement: string, position: number},...]

         */

    
 


        return "";
    }

    titleCapitalizer(title) {
        let firstChar = title.charAt(0);
        let firstCharCapitalized = firstChar.toUpperCase();
        let remainingString = title.slice(1);
        return `${firstCharCapitalized}${remainingString}`;
    }
    
}

module.exports = Translator;

const translator = new Translator();

let testStringAm = "Zipper Mr. Thomas zipperio zipperi";
let testStringBr = "Aeon artic aeon aeroplane or Mr Black";

//console.log(translator.locationProvider(testStringAm, ["zipper"]));
//console.log(translator.solver(testStringBr, "right"));
//console.log(translator.locationProvider(testString, "yellow"));
