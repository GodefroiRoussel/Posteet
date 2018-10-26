const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const digitHandler = Alexa.CreateStateHandler(config.APP_STATES.DIGIT_PACKAGE, {
    Init(nbTimeDigitRegistered) {
        if (nbTimeDigitRegistered < 3) {
            switch (nbTimeDigitRegistered) {
                case 0:
                    speechOutput = "Parfait ! Quels sont les 4 premiers numéros ? ";
                    break;
                case 1:
                    speechOutput = "Continuons maintenant avec les 4 prochains numéros. ";
                    break;
                default:
                    speechOutput = "C'est bientôt fini. Donnez moi les derniers numéros du colis. ";
            }
            ResponseHelper.sendResponse(this, speechOutput, "");
        } else {
            // Build the packageNumber
            const firstNumber = this.attributes.firstNumber;
            const letter = this.attributes.letter;
            const firstDigits = this.attributes.firstDigits;
            const secondDigits = this.attributes.secondDigits;
            const lastDigits = this.attributes.lastDigits;

            //TODO: Check slice
            const packageNumber = `${firstNumber}${letter}${firstDigits}${secondDigits}${lastDigits}`.slice(0, 13);

            // Return in the last handler and go to the endEnterPackageNumber
            this.handler.state = this.attributes.previousHandler;
            this.emitWithState('endEnterPackageNumber', packageNumber);
        }
    },
    FirstNumbers() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE'));
            ResponseHelper.sendResponse(this, `${speechOutput}`, "");
        } else {
            // Fill the first number and the letter
            this.attributes.firstNumber = this.event.request.intent.slots.number.value;
            this.attributes.letter = this.event.request.intent.slots.letter.value.toUpperCase().charAt(0);
            this.emitWithState('Init', 0);
        }
    },
    DigitsPackage() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE'));
            ResponseHelper.sendResponse(this, `${speechOutput}`, "");
        } else {
            let i = 0;
            const digits = this.event.request.intent.slots.digits.value;

            if (this.attributes.firstDigits === "") {
                i = 1;
                this.attributes.firstDigits = digits;
            } else if (this.attributes.secondDigits === "") {
                i = 2;
                this.attributes.secondDigits = digits;
            } else {
                i = 3;
                this.attributes.lastDigits = digits.value;
            }
            this.emitWithState('Init', i);
        }
    },
    LastNumbers() {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE'));
            ResponseHelper.sendResponse(this, `${speechOutput}`, "");
        } else {
            let i = 0;
            const numbers = this.event.request.intent.slots.numbers.value;

            if (this.attributes.firstDigits === "") {
                i = 1;
                this.attributes.firstDigits = numbers;
            } else if (this.attributes.secondDigits === "") {
                i = 2;
                this.attributes.secondDigits = numbers;
            } else {
                i = 3;
                this.attributes.lastDigits = numbers;
            }
            this.emitWithState('Init', i);
        }
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')));
    },
    'AMAZON.HelpIntent': function helpEnterNumbers() {
        let speechOutput = ''
        if (this.attributes.number === '')
            speechOutput = this.t('HELP_MESSAGE_NUMBER_LETTER');
        else if (this.attributes.firstDigits === '' || this.attributes.secondDigits === '')
            speechOutput = this.t('HELP_MESSAGE_DIGIT');
        else
            speechOutput = this.t('HELP_MESSAGE_NUMBER');
        ResponseHelper.sendResponse(this, speechOutput, null)
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