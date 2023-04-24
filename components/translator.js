const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {

    constructor(inputString, direction = "right") {
        this.replacementSet = new Set();
        this.initString = inputString;
        this.orgString = inputString;
        this.direction = direction;

    }


    centralBrain() {

        this.timeChanger();
        this.searchAndReplace();
        let markedResults = this.getPositionArray();

        return {orgString: this.orgString, translation: this.initString, changes: markedResults};
    }


    timeChanger() {
        let regexUS = /([0-9]{1,2})\:([0-9]{1,2})/g;
        let regexUK = /([0-9]{1,2})\.([0-9]{1,2})/g;
        let regex;
        let markedResults = {};
        let tempResults;
        let position;
        let orgKey;
        let newKey;

        if (this.direction == "right") {
            regex = regexUS;
            orgKey = ":";
            newKey = ".";
        } else {
            regex = regexUK;
            orgKey = ".";
            newKey = ":";
        };

        let regexResultArray = this.initString.match(regex);
        //console.log("Array: ", regexResultArray);
        
        let setTimes = new Set(regexResultArray);


        for (let timeOfSet of setTimes) {
            tempResults = this.locationArrayProvider(timeOfSet);
            markedResults[timeOfSet] = tempResults;
        }

        //console.log("b4: ", this.initString);
        this.initString = this.initString.replace(regex, function(match, hour, minute) {
            let returner = '<span class="highlight">' + hour + newKey + minute + '</span>';
            return returner;
        });
        //this.initString = this.initString.replaceAll(orgKey, newKey);
        if(this.direction == "left" && this.orgString.slice(-1) == ".") { this.initString = `${this.initString.slice(0,-1)}${this.orgString.slice(-1)}`; }
        //console.log("af: ", this.initString);
        
        //console.log("Result: ", markedResults);
    }

    getPositionArray() {
        let resultObj = {};
        this.replacementSet.forEach(element => {
            resultObj[element] = this.locationArrayProvider(element.toLowerCase())
        })
        return resultObj;
    }

    highlight (middle) {
        let highlighterB4 = '<span class="highlight">';
        let highlighterAf = '</span>';
        return highlighterB4 + middle + highlighterAf;
    }

    searchAndReplace() {
    
        let searchFiles;

        // Initiating all search objects
        if (this.direction == "right") {
            searchFiles = [americanOnly, americanToBritishSpelling, americanToBritishTitles];
        } else {
            searchFiles = [britishOnly, americanToBritishSpelling, americanToBritishTitles];  
        };

        // Enter one searchfile
        for (let searchFile of searchFiles) {

            for (let key in searchFile) {
                let searchString;
                let replaceString;

                // Define strings based on direction
                if (this.direction == "right" || searchFile.hasOwnProperty("abseil")) {
                    searchString = key;
                    replaceString = this.highlight(searchFile[key]);
                } else {
                    searchString = searchFile[key];
                    replaceString = this.highlight(key);
                }

                searchString = searchString.toLowerCase();
                replaceString = replaceString.toLowerCase();

                if (searchFile == americanToBritishTitles) {
                    replaceString = `${replaceString.slice(0,24)}${replaceString.charAt(24).toUpperCase()}${replaceString.slice(25)}`;
                }

                let positionFound = this.nextLocationProvider(searchString, 0);

                while (positionFound >= 0) {
                    
                    //console.log("Found: ", positionFound);
                    //console.log("b4: ", this.initString, "; ", searchString , " - to be replaced by: ", replaceString);
                    this.initString = `${this.initString.slice(0, positionFound)}${replaceString}${this.initString.slice(positionFound + searchString.length)}`;
                    //console.log("af: ", this.initString);
                    this.replacementSet.add(replaceString);
                    positionFound = this.nextLocationProvider(searchString, positionFound + 1);
                }
                
            }

        }

    }

    nextLocationProvider(searchTerm, startIndex = 0) {
        let inputString = this.initString.toLowerCase();
        searchTerm = searchTerm.toLowerCase();
        let foundPosition = inputString.indexOf(searchTerm, startIndex);

            if (foundPosition < 0) return -1;
            
            if (
                (foundPosition == 0 && inputString.charAt(foundPosition + searchTerm.length) == " " ) || 
                (foundPosition + searchTerm.length >= this.initString.length -1 && inputString.charAt(foundPosition - 1) == " " ) ||
                (inputString.charAt(foundPosition - 1) == " " && inputString.charAt(foundPosition + searchTerm.length) == " ")) {

                 //   console.log("Found position: ", foundPosition);
                    
                return foundPosition;
            }

    
    return -1;

    }


    locationArrayProvider(searchTerm) {

        /*
        (searchTerm) => {position: SearchTerm, ...}
        (string) => {int: string, ...}
        Searches the searchterm inside the spring and returns an objec with the positions
        */

        let inputString = this.initString.toLowerCase();
        searchTerm = searchTerm.toLowerCase();
        let startIndex = 0;
        let foundPos = 0;
        const returnerObj = [];

        
            while (startIndex < inputString.length) {
                if (inputString.indexOf(searchTerm, startIndex) == -1) break; 

                foundPos = inputString.indexOf(searchTerm, startIndex);
                if (
                 (foundPos == 0 && inputString.charAt(foundPos + searchTerm.length) == " " ) || 
                 (foundPos + searchTerm.length >= this.initString.length - 1 && inputString.charAt(foundPos - 1) == " " ) || 
                 (inputString.charAt(foundPos - 1) == " " && inputString.charAt(foundPos + searchTerm.length) == " ")) {
                    if (foundPos < 0) break;
                    returnerObj.push(foundPos);
                    //console.log("Found position: ", foundPos);
                    startIndex = foundPos + 1;
                }
                startIndex = startIndex + 1;
            }
        
        if (returnerObj.length > 0) {
            return returnerObj;
        } else {
            return false;
        }
    }
}

let testStringAm = "Dr. Zipper at 10:30 10:30 and at 9:30.";
let testStringBr = "Mango Artic aubergine mango.";

module.exports = Translator;

//let solver = new Translator(testStringBr, "left");

//let solver2 = new Translator(testStringAm, "right");

//console.log(solver.centralBrain());
//console.log(solver2.centralBrain());

