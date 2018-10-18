module.exports = {
    DYNAMODB_TABLE: 'Posteet',


    APP_STATES: {
        START: "_START", // Entry point, start the application.
    },
    AUDIO: src => `<audio src="${src}"/>`,

    START_APP_SOUND: 'https://s3-eu-west-1.amazonaws.com/alexasoundstrivia/sncf.mp3',
    WAIT_RESPONSE_SOUND: 'https://s3-eu-west-1.amazonaws.com/alexasoundstrivia/wait_sound.mp3',
    IMAGE_BACKGROUND_URL: 'http://www.galwaytourcompany.com/wp-content/uploads/2017/10/Connemara-Wild-Atlantic-Way.jpg',

    APP_ID: 'amzn1.ask.skill.fc08466f-0f6f-4d27-bb24-841911b56413', // TODO replace with your app ID

    languageString: {
        "fr-FR": {
            translation: {
                //General
                EXIT_INSTRUCTIONS: 'Vous pouvez quitter l\'application en disant "Alexa quitte". ',
                UNHANDLE_MESSAGE: "Je suis désolé, je n'ai pas compris ce que vous venez de dire. ",
                STOP_MESSAGE: "Merci d'avoir utilisé notre application. J'espère vous revoir très bientôt. ",
                ASK_ACTION: "Que souhaitez vous faire? ",

                // startFlightHandler
                WELCOME_APP_MESSAGE: 'Bienvenue sur %s . ',
                APP_NAME: 'Posteet ',
                WELCOME_MESSAGE: 'Je vais vous aider avec les différents service de La Poste. ',
                REGISTER_PACKAGE: 'Vous pouvez enregistrer un colis. ',
                RETRIEVE_INFO_PACKAGE: "Vous pouvez savoir où se trouve un de vos colis enregistrés. ",
                OPTIONS_MESSAGE: 'Quel service souhaitez-vous demander? Vous pouvez enregistrer un colis ou bien retrouver un colis enregistré précédemment.',

            }
        }
    }
}