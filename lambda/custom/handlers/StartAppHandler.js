const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const SentenceHelper = require('../Helpers/SentenceHelper');
const DB = require('../Database/DB');

const startAppHandler = Alexa.CreateStateHandler(config.APP_STATES.START, {
    Welcome() {
        this.attributes.speechOutput = this.t('WELCOME_APP_MESSAGE', this.t('APP_NAME'));
        this.attributes.speechOutput += this.t('WELCOME_MESSAGE');
        this.emitWithState('Menu');
    },
    Menu() {
        const alexa = this;
        let speechOutput = this.attributes.speechOutput;
        this.attributes.speechOutput = '';
        speechOutput += this.t('REGISTER_PACKAGE');
        DB.getSession(alexa.event.context.System.user.userId)
            .then(session => {
                if (session.packages) {
                    speechOutput += this.t('RETRIEVE_INFO_PACKAGE');
                    speechOutput += this.t('DELETE_PACKAGE');
                }
                //speechOutput += this.t("FIND_POSTE")
                speechOutput += this.t("PRICE_PACKAGE")
                speechOutput += this.t("ASK_MENU");
                DB.save(alexa.event.context.System.user.userId, session)
                    .then(() => {
                        ResponseHelper.sendResponse(alexa, `${speechOutput}`, this.t('START_REPROMPT_MESSAGE'));
                    })
                    .catch(err => {
                        console.log(err);
                        ResponseHelper.sendResponse(alexa, `${SentenceHelper.getSentence(alexa.t("API_PROBLEM"))} `, null, null, null, null, false);
                    });
            })
            .catch(err => {
                console.log(err);
                ResponseHelper.sendResponse(alexa, `${alexa.t("AMAZON_ERROR")} `, null, null, null, null, false);
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
    DeletePackage() {
        this.handler.state = config.APP_STATES.DELETE_PACKAGE;
        this.emitWithState('Init');
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE')), this.t("START_REPROMPT_MESSAGE"));
    },
    'AMAZON.HelpIntent': function helpStart() {
        this.attributes.speechOutput = this.t("HELP_MESSAGE_MENU");
        this.emitWithState('Menu');
    },
    'AMAZON.StopIntent': function stopGame() {
        ResponseHelper.sendResponse(this, SentenceHelper.getSentence(this.t('STOP_MESSAGE')), null, null, null, null, false)
    },
    'AMAZON.CancelIntent': function stopGame() {
        this.emitWithState('AMAZON.StopIntent');
    }
});

module.exports = startAppHandler;