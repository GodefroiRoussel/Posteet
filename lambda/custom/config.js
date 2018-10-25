module.exports = {
    DYNAMODB_TABLE: 'Posteet',
    API_KEY: 'RIyLQtfaUXefAhM60nqT6Bcy63Fn2v73kEYW5TINBUWvlyGnD1Gk2W3CgQKlH/IP',

    APP_STATES: {
        START: "_START", // Entry point, start the application.
        REGISTER_PACKAGE: "_REGISTER_PACKAGE",
        FIND_PACKAGE: "_FIND_PACKAGE",
        PRICE_PACKAGE: "_PRICE_PACKAGE",
        DELETE_PACKAGE: "_DELETE_PACKAGE",
    },
    AUDIO: src => `<audio src="${src}"/>`,

    START_APP_SOUND: 'https://s3-eu-west-1.amazonaws.com/alexasoundstrivia/sncf.mp3',
    WAIT_RESPONSE_SOUND: 'https://s3-eu-west-1.amazonaws.com/alexasoundstrivia/wait_sound.mp3',
    IMAGE_BACKGROUND_URL: 'http://www.galwaytourcompany.com/wp-content/uploads/2017/10/Connemara-Wild-Atlantic-Way.jpg',

    APP_ID: 'amzn1.ask.skill.8589531b-402f-4178-8202-ba354200d2c3', // TODO replace with your app ID

    languageString: {
        "fr-FR": {
            translation: {
                //General
                EXIT_INSTRUCTIONS: 'Vous pouvez quitter l\'application en disant "Alexa quitte". ',
                UNHANDLE_MESSAGE: "Je suis désolé, je n'ai pas compris ce que vous venez de dire. ",
                STOP_MESSAGE: "Merci d'avoir utilisé notre application. J'espère vous revoir très bientôt. ",
                ASK_ACTION: "Que souhaitez vous faire? ",
                CANCEL_MESSAGE: "Très bien, retournons sur le menu. ",
                API_PROBLEM: "Cependant le service est temporairement indisponible, réessayez plus tard. ",
                ASK_OTHER_ACTION: "Souhaitez vous faire autre chose avec notre application? ",
                WRONG_UNDERSTANDING_PACKAGE: "Ah j'ai mal compris votre numéro de colis ? Recommençons ! Dites moi votre numéro de colis ou dites 'Annuler' pour retourner à l'accueil. ",

                // startFlightHandler
                WELCOME_APP_MESSAGE: 'Bienvenue sur %s . ',
                APP_NAME: 'Posteet ',
                WELCOME_MESSAGE: 'Je vais vous aider avec les différents service de La Poste. ',
                REGISTER_PACKAGE: 'Vous pouvez enregistrer un colis. ',
                DELETE_PACKAGE: 'Vous pouvez supprimer un colis.',
                RETRIEVE_INFO_PACKAGE: "Vous pouvez savoir où se trouve un de vos colis enregistrés. ",
                OPTIONS_MESSAGE: 'Quel service souhaitez-vous demander? Vous pouvez enregistrer un colis ou bien retrouver un colis enregistré précédemment. ',

                // Register Package Handler
                INIT_REGISTRATION: 'On va maintenant enregistrer votre colis. Veuillez me donner votre numéro de colis. ',
                PACKAGE_REGISTERED: "Parfait, j'ai enregistré votre colis. Vous pouvez dès à présent suivre votre colis en disant 'Alexa où en est mon colis'. ",

                // Delete Package Handler
                INIT_DELETION: 'Veuillez me donner le numéro de colis que vous souhaitez supprimer. ',
                PACKAGE_DELETED: "Votre colis a bien été supprimé. ",
                PACKAGE_DOESNT_EXISTS: "Votre colis n'existe pas. ",
                PACKAGES_EMPTY: "Vous n'avez aucun colis enregistré. ",

                // Find Package Handler
                WRONT_TYPE: "Le problème vient de chez nous et nous travaillons actuellement dessus. Merci de votre compréhension. ",
                TRY_ANOTHER_PACKAGE_NUMBER: "Essayez de donner un nouveau numéro de colis. ",

                ONE_PACKAGE_REGISTER: "Vous avez actuellement un seul colis enregistré. ",
                MANY_PACKAGES_REGISTER: "Vous avez actuellement plusieurs colis déjà enregistré, je vais faire une recherche pour chaque colis. ",
                NO_PACKAGE_REGISTER: "Vous n'avez pas de colis déjà enregistré, veuillez me donner le numéro de colis que je dois chercher. ",

            }
        }
    }
}