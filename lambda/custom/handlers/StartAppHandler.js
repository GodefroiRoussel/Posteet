const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');
const DB = require('../Database/DB');

const startAppHandler = Alexa.CreateStateHandler(config.APP_STATES.START, {
    Welcome() {
        this.attributes.speechOutput = config.AUDIO(config.AUDIO(config.START_APP_SOUND));
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
                }
                DB.save(alexa.event.context.System.user.userId, session).then(() => {
                    ResponseHelper.sendResponse(alexa, `${speechOutput}`, this.t('OPTIONS_MESSAGE'));
                });
            })
            .catch(err => {
                console.log(err);
            });
    },
    RegisterPackage() {
        this.handler.state = config.APP_STATES.REGISTER_PACKAGE;
        this.emitWithState('Init');
    },
    FindPackage() {
        this.handler.state = config.APP_STATES.FIND_PACKAGE;
        this.emitWithState('FindPackage');
    },
    PricePackage() {
        this.handler.state = config.APP_STATES.PRICE_PACKAGE;
        this.emitWithState('PricePackage');
    },
    'AMAZON.RepeatIntent': function RepeatOption() {
        this.attributes.speechOutput = 'Je suis passé dans le repète intent';
        this.emitWithState('Menu');
    },
    Unhandled() {
        ResponseHelper.sendResponse(this, this.t('UNHANDLE_MESSAGE'));
    },
    'AMAZON.StopIntent': function stopGame() {
        const speechOutput = this.t('STOP_MESSAGE');
        this.response.speak(speechOutput).listen(speechOutput);
        this.emit(':responseReady');
    },
});

module.exports = startAppHandler;