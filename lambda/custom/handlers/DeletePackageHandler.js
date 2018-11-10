const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const deletePackageHandler = Alexa.CreateStateHandler(config.APP_STATES.DELETE_PACKAGE, {
    Init() {
        const alexa = this;

        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages && session.packages.length > 1) {
                    // Init variables that will be implemented
                    alexa.attributes.firstNumber = "";
                    alexa.attributes.letter = "";
                    alexa.attributes.firstDigits = "";
                    alexa.attributes.secondDigits = "";
                    alexa.attributes.lastDigits = "";

                    speechOutput = SentenceHelper.getSentence(alexa.t('INIT_DELETION'));
                    ResponseHelper.sendResponse(alexa, `${speechOutput} `, alexa.t("DELETE_REPROMPT_MESSAGE"));
                }
                else {
                    alexa.attributes.speechOutput = alexa.t('DELETE_IMPOSSIBLE');
                    alexa.handler.state = config.APP_STATES.START;
                    alexa.emitWithState('Menu');
                }
            }).catch(err => {
                console.log(err);
                ResponseHelper.sendResponse(alexa, `${alexa.t("AMAZON_ERROR")} `, null, null, null, null, false);
            });
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
                    if (session.packages.includes(packageNumber)) {
                        session.packages.splice(session.packages.indexOf(packageNumber), 1);
                        this.attributes.speechOutput = SentenceHelper.getSentence(this.t("PACKAGE_DELETED"))
                        DB.save(alexa.event.context.System.user.userId, session)
                            .then(() => {
                                this.emitWithState('Menu');
                            })
                            .catch(err => {
                                console.log(err);
                                const speechOutput = this.t('AMAZON_ERROR');
                                ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);

                            });
                    }
                    else {
                        this.attributes.speechOutput = SentenceHelper.getSentence(this.t("PACKAGE_DOESNT_EXISTS"));
                        this.emitWithState('Menu');
                    }

                } else {
                    this.attributes.speechOutput = SentenceHelper.getSentence(this.t("PACKAGES_EMPTY"))
                    this.emitWithState('Menu');
                }

            })
            .catch(err => {
                console.log(err);
                const speechOutput = this.t('AMAZON_ERROR');
                ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);
            });
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
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')), this.t("DELETE_REPROMPT_MESSAGE"));
    },
    'AMAZON.HelpIntent': function helpStart() {
        ResponseHelper.sendResponse(this, this.t("HELP_MESSAGE_DELETE"), this.t("DELETE_REPROMPT_MESSAGE"))
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

module.exports = deletePackageHandler;