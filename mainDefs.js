"use strict";
exports.__esModule = true;
// Imports
var fs_1 = require("fs");
var GphApiClient = require("giphy-js-sdk-core");
var request_1 = require("request");
var toml_1 = require("toml");
// Define Vars
var config = toml_1.parse(fs_1.readFileSync("./config/config.toml", "utf-8"));
exports.config = config;
var giphy = GphApiClient(config.Giphy.apikey);
exports.giphy = giphy;
function textToArray(path) {
    if (typeof path !== "string") {
        throw new TypeError("Path supplyed is not a string");
    }
    var text = fs_1.readFileSync(path, "utf-8");
    var textByLine = text.split("\n");
    return textByLine;
}
exports.textToArray = textToArray;
function checkLink(linktotest, done, service) {
    var link = service || "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyAUfpmb1XJc2SSnWZT27Ena_0e4kCv1T4Q";
    request_1.post({
        url: link,
        json: {
            client: {
                clientId: "chatbot",
                clientVersion: "2.0.0"
            },
            threatInfo: {
                threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [
                    { url: linktotest },
                ]
            }
        }
    }, function (err, res, body) {
        if (err) {
            throw err;
        }
        if ("error" in body) {
            throw new Error("ERROR: " + body.error.message);
        }
        if ("threatType" in body.matches[0]) {
            done(null, body.matches[0].threatType);
        }
        else if (body === {}) {
            done(null, null);
        }
    });
}
exports.checkLink = checkLink;