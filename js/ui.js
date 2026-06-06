import { searchQueries, fetchQuery } from "./chatbot.js";
import { Query } from "./elements.js"

var messageView = document.getElementById("messages");
var input = document.getElementById("input");
var submitButton = document.getElementById("submit");
var suggestionsView = document.getElementById("suggestions");

input.addEventListener("input", textChanged);
//input.addEventListener("submit", textSubmitted);

var opener = document.createElement("p");
opener.className = "answer";
opener.innerText = "Welcome to the GRDA Custodial Support Assistant 🛡️\n\nI am ready to help you with Buffet Setup, Sanitation, or Event Preparation. Enter your question below, and select one of the options that appears.\n\n(if no options appear, it is either out of the scope of my assistance OR you may have made a spelling error)";
addMessage(opener);

var promptItems = ["Coffee", "Sanitizer", "Preparation"];
var prompts = document.createElement("div");
prompts.className = "hbox answer";
prompts.style = "gap: 5px;"
for (var i = 0; i < 3; i++) {
    var prompt = document.createElement("p");
    prompt.className = "checklist-item";
    prompt.textContent = promptItems[i];
    prompt.addEventListener("click", clickPrompt);
    prompts.appendChild(prompt);
}
addMessage(prompts);

function clickPrompt(c) {
    input.value = c.target.textContent;
    textChanged();
}

function textChanged() {
    var searchResult = searchQueries(input.value);
    var suggestions = [];
    for (var i = 0; i < searchResult.length; i++) {
        console.log(fetchQuery(searchResult[i]));

        suggestions.push(new Query(fetchQuery(searchResult[i]).questions[0] + "?", fetchQuery(searchResult[i]).answer, searchResult[i]));
    }

    setSuggestions(suggestions);
}

function clearSuggestions() {
    while (suggestionsView.childElementCount > 0) suggestionsView.removeChild(suggestionsView.firstChild);
}

function setSuggestions(suggestions) {
    clearSuggestions();
    for (var i = 0; i < suggestions.length; i++) {
        var suggestion = document.createElement("p");
        suggestion.className = "suggestion";
        suggestion.innerText = suggestions[i].question;
        suggestion.suggestion = suggestions[i];
        suggestion.addEventListener("click", clickSuggestion);

        suggestionsView.appendChild(suggestion);
    }
}

function clickSuggestion(c) {
    clearSuggestions();

    //add question to chat
    var question = document.createElement("p");
    question.className = "question";
    question.innerText = c.target.suggestion.question;
    addMessage(question, true);

    //add answer to chat
    var answer = document.createElement("p");
    answer.className = "answer";
    answer.innerText = c.target.suggestion.answer;
    //fake delay lol
    setTimeout(() => { addMessage(answer, true) }, 1000);

    //add items to chat
    var query = fetchQuery(c.target.suggestion.id);

    if (query.type == "checklist") {
        //fake delay lol
        setTimeout(() => { addMessage(createChecklist(query.items), true) }, 2000);
    }
}

function createChecklist(items) {
    var checklist = document.createElement("div");
    checklist.className = "vbox answer";

    var title = document.createElement("p");
    title.style = "font-weight: bold;";
    title.innerText = "Interactive Checklist\n(Click to check items)";
    checklist.appendChild(title);

    for (var i = 0; i < items.length; i++) {
        var item = document.createElement("p");
        item.className = "checklist-item";
        item.innerText = (i + 1) + ". " + items[i];
        item.checked = false;
        item.addEventListener("click", checkItem);

        checklist.appendChild(item);
    }

    return checklist;
}

function checkItem(c) {
    var item = c.target;
    item.checked = !item.checked;
    if (item.checked) {
        item.style = "text-decoration: line-through; color: lightgray; background-color: rgba(31, 139, 0, 0.5);";
    }
    else {
        item.style = "";
    }
}

function createImage() {

}

function addMessage(element, scroll = false) {
    messageView.appendChild(element);
    if (scroll) messageView.scrollTop = messageView.scrollHeight;
}