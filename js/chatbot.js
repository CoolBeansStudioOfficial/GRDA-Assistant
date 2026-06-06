const queries = (await (await fetch("./queries.json")).json()).queries;

//returns the id's of queries that match an input string
export function searchQueries(string) {
    var results = []

    //search queries for matching string
    var bestMatch = 0;
    for (var i = 0; i < queries.length; i++) {
        //search each phrasing of the query
        for (var j = 0; j < queries[i].questions.length; j++) {
            var matches = getWordMatches(queries[i].questions[j].toLowerCase(), string.toLowerCase());

            //if the string matches the most words in a query, make it the only result on the list
            if (matches > bestMatch) {
                results.length = 0;
                results.push(i);
                bestMatch = matches;
                console.log("new best match found: " + bestMatch);
                break;
            }
            //if the string ties with the current best results, add it to the list of results
            //(ignore zero word matches)
            else if (matches == bestMatch && matches > 0) {
                results.push(i);
                console.log("equal match found: " + bestMatch);
                break;
            }
        }
    }

    return results;
}

//returns the number of matching words between two strings
function getWordMatches(string1, string2) {
    var words1 = string1.split(" ");
    var words2 = string2.split(" ");

    var matches = 0;
    //compare each word in string 1 against each word in string 2
    for (var i = 0; i < words1.length; i++) {
        //if a match is found, move on to the next word
        for (var j = 0; j < words2.length; j++) {
            if (words1[i] == words2[j]) {
                matches++;
                break;
            }
        }
    }

    return matches;
}

export function fetchQuery(id) {
    //create instance of message and return it

    return queries[id];
}
