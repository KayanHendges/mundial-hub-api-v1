"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function titleize(text) {
    var words = text.toLowerCase().split(" ");
    var emptySpace = 0;
    for (var a = 0; a < words.length; a++) {
        var w = words[a];
        if (w.length == 0) {
            emptySpace = emptySpace + 1;
        }
        else {
            words[(a - emptySpace)] = w[0].toUpperCase() + w.slice(1);
        }
    }
    return words.join(" ");
}
exports.default = titleize;
