const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const registerPackageHandler = Alexa.CreateStateHandler(config.APP_STATES.REGISTER_PACKAGE, {
    Init() {
        speechOutput = SentenceHelper.getSentence(this.t('INIT_REGISTRATION'));

        // Init variables that will be implemented
        this.attributes.firstNumber = "";
        this.attributes.letter = "";
        this.attributes.firstDigits = "";
        this.attributes.secondDigits = "";
        this.attributes.lastDigits = "";

        ResponseHelper.sendResponse(this, `${speechOutput} `, this.t("REGISTER_REPROMPT_MESSAGE"));
    },
    FirstNumbers() {
        this.attributes.turn = 0;
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE')) + this.t("FIRST_INSTRUCTION_REPROMPT_MESSAGE");
            ResponseHelper.sendResponse(this, `${speechOutput}`, this.t("FIRST_INSTRUCTION_REPROMPT_MESSAGE"));
        } else {
            this.attributes.previousHandler = this.handler.state;
            this.handler.state = config.APP_STATES.DIGIT_PACKAGE;
            // Fill the first number and the letter
            this.attributes.firstNumber = this.event.request.intent.slots.number.value;
            this.attributes.letter = this.event.request.intent.slots.letter.value.toUpperCase().charAt(0);
            this.emitWithState('Init');
        }
    },
    endEnterPackageNumber(packageNumber) {
        const alexa = this;

        // Redirection to the Start of the skill
        this.handler.state = config.APP_STATES.START;

        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages) {
                    session.packages.push(packageNumber)
                } else {
                    const obj = {
                        packages: [
                            packageNumber
                        ]
                    }
                    session.packages = obj.packages
                }

                DB.save(alexa.event.context.System.user.userId, session).then(() => {
                    speechOutput = SentenceHelper.getSentence(this.t("PACKAGE_REGISTERED"))
                    ResponseHelper.sendResponse(alexa, `${speechOutput} `, this.t("END_REGISTER_REPROMPT_MESSAGE"));
                })
                    .catch(err => {
                        console.log(err);
                        const speechOutput = this.t('AMAZON_ERROR');
                        ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);
                    });
            })
            .catch(err => {
                console.log(err);
                const speechOutput = this.t('AMAZON_ERROR');
                ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);
            });
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
    'AMAZON.CancelIntent': function stopGame() {
        this.attributes.speechOutput = SentenceHelper.getSentence(this.t("CANCEL_MESSAGE"));
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Menu');
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = SentenceHelper.getSentence(this.t('STOP_MESSAGE'));
        ResponseHelper.sendResponse(this, speechOutput, null, null, null, null, false)
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')), this.t("REGISTER_REPROMPT_MESSAGE"));
    },
    'AMAZON.HelpIntent': function helpStart() {
        ResponseHelper.sendResponse(this, this.t("HELP_MESSAGE_REGISTER"), this.t("REGISTER_REPROMPT_MESSAGE"));
    },
});

module.exports = registerPackageHandler;