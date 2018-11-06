const Alexa = require('alexa-sdk');
const config = require('./config');

/**
 * Helpers
 */
const ResponseHelper = require('./Helpers/ResponseHelper');
const SentenceHelper = require('./Helpers/SentenceHelper');

/**
 * We import handlers as they are separated in different files
 */
const startAppHandler = require('./handlers/StartAppHandler');
const registerPackageHandler = require('./handlers/RegisterPackageHandler');
const findPackageHandler = require('./handlers/FindPackageHandler');
const pricePackageHandler = require('./handlers/PricePackageHandler');
const deletePackageHandler = require('./handlers/DeletePackageHandler');
const digitHandler = require('./handlers/DigitHandler');
//const findClosestOffice = require('./handlers/FindClosestPostingServiceHandler');



const newSessionHandlers = {
    LaunchRequest: function () {
        this.handler.state = config.APP_STATES.START;
        this.emitWithState('Welcome');
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
        this.handler.state = config.APP_STATES.START;
        this.attributes.speechOutput = SentenceHelper.getSentence(this.t('UNHANDLE_MESSAGE'));
        this.emitWithState('Menu')
    },
    'AMAZON.HelpIntent': function helpStart() {
        this.handler.state = config.APP_STATES.START;
        this.attributes.speechOutput = this.t("HELP_MESSAGE_MENU");
        this.emitWithState('Menu');
    },
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = config.APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = config.languageString;
    alexa.registerHandlers(
        newSessionHandlers,
        startAppHandler,
        registerPackageHandler,
        findPackageHandler,
        pricePackageHandler,
        deletePackageHandler,
        digitHandler,
        //findClosestOffice
    );
    alexa.execute();
};