const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const deletePackageHandler = Alexa.CreateStateHandler(config.APP_STATES.DELETE_PACKAGE, {
    Init() {
        // Init variables that will be implemented
        this.attributes.firstNumber = "";
        this.attributes.letter = "";
        this.attributes.firstDigits = "";
        this.attributes.secondDigits = "";
        this.attributes.lastDigits = "";

        speechOutput = SentenceHelper.getSentence(this.t('INIT_DELETION'));
        ResponseHelper.sendResponse(this, `${speechOutput} `, this.t("DELETE_REPROMPT_MESSAGE"));

    },
    FirstNumbers() {
        this.attributes.previousHandler = this.handler.state;
        this.handler.state = config.APP_STATES.DIGIT_PACKAGE;
        this.emitWithState('FirstNumbers');
    },
    endEnterPackageNumber(packageNumber) {
        const alexa = this;

        // Redirection to the Start of the application
        this.handler.state = config.APP_STATES.START;

        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {

                if (session.packages) {
                    if (session.packages.includes(packageNumber)) {
                        session.packages.splice(session.packages.indexOf(packageNumber), 1);
                        const speechOutput = SentenceHelper.getSentence(this.t("PACKAGE_DELETED"))
                        DB.save(alexa.event.context.System.user.userId, session)
                            .then(() => {
                                const repromptSpeech = this.t("START_REPROMPT_MESSAGE");
                                ResponseHelper.sendResponse(alexa, `${speechOutput}`, repromptSpeech);
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
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('Init');
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