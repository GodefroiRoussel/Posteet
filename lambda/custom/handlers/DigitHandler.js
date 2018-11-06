const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const digitHandler = Alexa.CreateStateHandler(config.APP_STATES.DIGIT_PACKAGE, {
    Init() {
        const nbTimeDigitRegistered = this.attributes.turn;
        if (nbTimeDigitRegistered < 3) {
            const speechOutput = this.t("DIGIT_INSTRUCTIONS")[nbTimeDigitRegistered];
            const repromptSpeech = this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[nbTimeDigitRegistered];
            ResponseHelper.sendResponse(this, speechOutput, repromptSpeech);
        } else {
            // Build the packageNumber
            const firstNumber = this.attributes.firstNumber;
            const letter = this.attributes.letter;
            const firstDigits = this.attributes.firstDigits;
            const secondDigits = this.attributes.secondDigits;
            const lastDigits = this.attributes.lastDigits;

            const packageNumber = `${firstNumber}${letter}${firstDigits}${secondDigits}${lastDigits}`.slice(0, 13);

            // Return in the last handler and go to the endEnterPackageNumber
            this.handler.state = this.attributes.previousHandler;
            this.emitWithState('endEnterPackageNumber', packageNumber);
        }
    },
    DigitsPackage() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE')) + this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn];
            ResponseHelper.sendResponse(this, `${speechOutput}`, this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn]);
        } else {
            const digits = this.event.request.intent.slots.digits.value;

            if (this.attributes.firstDigits === "")
                this.attributes.firstDigits = digits;
            else if (this.attributes.secondDigits === "")
                this.attributes.secondDigits = digits;
            else
                this.attributes.lastDigits = digits.value;

            this.attributes.turn += 1;
            this.emitWithState('Init');
        }
    },
    LastNumbers() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE')) + this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn];
            ResponseHelper.sendResponse(this, `${speechOutput} `, this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn]);
        } else {
            const numbers = this.event.request.intent.slots.numbers.value;

            if (this.attributes.firstDigits === "")
                this.attributes.firstDigits = numbers;
            else if (this.attributes.secondDigits === "")
                this.attributes.secondDigits = numbers;
            else
                this.attributes.lastDigits = numbers;

            this.attributes.turn += 1;
            this.emitWithState('Init');
        }
    },
    RegisterPackage() {
        this.handler.state = config.APP_STATES.REGISTER_PACKAGE;
        this.emitWithState('Init');
    },
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('Init');
    },
    PricePackage() {
        this.handler.state = config.APP_STATES.PRICE_PACKAGE;
        this.emitWithState('PricePackage');
    },
    DeletePackage() {
        this.handler.state = config.APP_STATES.DELETE_PACKAGE;
        this.emitWithState('Init');
    },
    Unhandled() {
        let repromptSpeech = "";
        if (this.attributes.number !== '')
            repromptSpeech = this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn];
        else
            repromptSpeech = this.t("FIRST_INSTRUCTION_REPROMPT_MESSAGE");
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')), repromptSpeech);
    },
    'AMAZON.HelpIntent': function helpEnterNumbers() {
        let speechOutput = '';
        let repromptSpeech = '';
        if (this.attributes.number === '') {
            speechOutput = this.t('HELP_MESSAGE_NUMBER_LETTER');
            repromptSpeech = this.t("FIRST_INSTRUCTION_REPROMPT_MESSAGE");
        }
        else if (this.attributes.firstDigits === '' || this.attributes.secondDigits === '') {
            speechOutput = this.t('HELP_MESSAGE_DIGIT');
            repromptSpeech = this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn];
        }
        else {
            speechOutput = this.t('HELP_MESSAGE_NUMBER');
            repromptSpeech = this.t("DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE")[this.attributes.turn];
        }
        ResponseHelper.sendResponse(this, speechOutput, repromptSpeech)
    },
    'AMAZON.CancelIntent': function stopGame() {
        this.attributes.speechOutput = SentenceHelper.getSentence(this.t("CANCEL_MESSAGE"));
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Menu');
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = SentenceHelper.getSentence(this.t('STOP_MESSAGE'));
        ResponseHelper.sendResponse(this, speechOutput, null, null, null, null, false)
    },
});

module.exports = digitHandler;