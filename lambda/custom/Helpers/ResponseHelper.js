const Alexa = require('alexa-sdk');
const config = require('../config');

const builder = new Alexa.templateBuilders.BodyTemplate1Builder();
const {
    utils: {
        TextUtils: { makeRichText },
    },
} = Alexa;
const {
    utils: {
        ImageUtils: { makeImage },
    },
} = Alexa;

/**
 * Check if the device has a display
 * @param {Object} event incoming request to Alexa
 */
function supportsDisplay() {
    const hasDisplay =
        this.event.context &&
        this.event.context.System &&
        this.event.context.System.device &&
        this.event.context.System.device.supportedInterfaces &&
        this.event.context.System.device.supportedInterfaces.Display;
    return hasDisplay;
}

/**
 * Send the response to the Alexa device with display if device has one
 * @param {String} speechOutput Speech we want Alexa to say
 * @param {String} repromptSpeech Sentence Alexa will repeat if user doesn't answer back
 * @param {Object} alexa Alexa object responsible for handling the dialogue
 * and response construction
 */
function sendResponse(alexa, speechOutput, repromptSpeech, cardTitle, image, textToPrint, shouldListen = true) {
    if (!cardTitle) cardTitle = alexa.t('GAME_NAME');
    if (!image) image = config.IMAGE_BACKGROUND_URL;
    if (!textToPrint) textToPrint = speechOutput;
    if (!repromptSpeech) repromptSpeech = speechOutput;

    // TODO: Correct the bug when speaking to an echo show
    /*if (supportsDisplay(alexa.event)) {
      const template = builder
        .setTitle(cardTitle)
        .setBackgroundImage(makeImage(image))
        .setTextContent(makeRichText(textToPrint), null)
        .build();
      alexa.response.renderTemplate(template);
    }*/

    shouldListen ? alexa.response.speak(speechOutput).listen(repromptSpeech) : alexa.response.speak(speechOutput);
    alexa.emit(':responseReady');
}

function sendResponseWithCard(alexa, response) {
    const card = response.card;
    alexa.response.cardRenderer(card.title, card.content).speak(response.outputSpeech);
    alexa.emit(':responseReady');
}

function askForUserPermission(alexa, speechOutput, permissions) {
    alexa.response.askForPermissionsConsentCard(permissions).speak(speechOutput);
    alexa.emit(':responseReady');
}

module.exports = { sendResponse, sendResponseWithCard, askForUserPermission, supportsDisplay };