const Alexa = require('alexa-sdk');
const config = require('../config');
const ResponseHelper = require('../Helpers/ResponseHelper');

const startAppHandler = Alexa.CreateStateHandler(config.APP_STATES.START, {
    Welcome() {
        this.attributes.speechOutput = config.AUDIO(config.AUDIO(config.START_APP_SOUND));
        this.attributes.speechOutput = this.t('WELCOME_APP_MESSAGE', this.t('APP_NAME'));
        this.attributes.speechOutput += this.t('WELCOME_MESSAGE');
        this.emitWithState('Menu');
    },
    Menu() {
        let speechOutput = this.attributes.speechOutput;
        this.attributes.speechOutput = '';
        speechOutput += this.t('MENU_MESSAGE');
        ResponseHelper.sendResponse(this, `${speechOutput} ${config.AUDIO(config.WAIT_RESPONSE_SOUND)}`, this.t('MENU_MESSAGE'));
    },
    RegisterPackage() {
        speechOutput = 'Félicitations, vous voulez enregistrez un colis. Maintenant codez !'
        ResponseHelper.sendResponse(this, `${speechOutput} `, "", null, null, null, false);
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