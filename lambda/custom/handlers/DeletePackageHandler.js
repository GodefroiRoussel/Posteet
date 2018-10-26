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
        ResponseHelper.sendResponse(this, `${speechOutput} `, "");

    },
    FirstNumbers() {
        this.attributes.previousHandler = this.handler.state;
        this.handler.state = config.APP_STATES.DIGIT_PACKAGE;
        this.emitWithState('FirstNumbers');
    },
    endEnterPackageNumber(packageNumber) {
        const confirmationStatus = this.event.request.intent.confirmationStatus;
        if (confirmationStatus === 'NONE') {
            this.emit(':delegate')
        } else if (confirmationStatus === 'DENIED') {
            speechOutput = SentenceHelper.getSentence(this.t('WRONG_UNDERSTANDING_PACKAGE'));
            ResponseHelper.sendResponse(this, `${speechOutput}`, "");
        } else {
            const alexa = this;

            DB.getSession(alexa.event.context.System.user.userId)
                .then(session => {
                    // Redirection to the Start of the application
                    this.handler.state = config.APP_STATES.START;

                    if (session.packages) {
                        if (session.packages.includes(packageNumber)) {
                            session.packages.splice(session.packages.indexOf(packageNumber), 1);
                            speechOutput = SentenceHelper.getSentence(this.t("PACKAGE_DELETED"))
                            DB.save(alexa.event.context.System.user.userId, session)
                                .then(() => {
                                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, "");
                                })
                                .catch(err => {
                                    console.log(err);
                                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, null, null, null, null, false);
                                    const speechOutput = this.t('AMAZON_ERROR');
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
        }
    },
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('Init');
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')));
    },
    'AMAZON.HelpIntent': function helpStart() {
        ResponseHelper.sendResponse(this, this.t("HELP_MESSAGE_DELETE"))
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