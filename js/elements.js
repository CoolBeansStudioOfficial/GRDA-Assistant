export function Query(question, answer, id) {
    this.question = question;
    this.answer = answer;
    this.id = id;
}

export function Message(type, message, items) {
    this.type = type;
}