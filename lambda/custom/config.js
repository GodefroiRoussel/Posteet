module.exports = {
    DYNAMODB_TABLE: 'Posteet',
    API_KEY: 'RIyLQtfaUXefAhM60nqT6Bcy63Fn2v73kEYW5TINBUWvlyGnD1Gk2W3CgQKlH/IP',
    DISTANCE_API_KEY: 'c7SPFYk2naeqwlAxGfJlHYi9426VVnBk',
   
    APP_STATES: {
        START: "_START", // Entry point, start the application.
        REGISTER_PACKAGE: "_REGISTER_PACKAGE",
        FIND_PACKAGE: "_FIND_PACKAGE",
        PRICE_PACKAGE: "_PRICE_PACKAGE",
        DELETE_PACKAGE: "_DELETE_PACKAGE",
        DIGIT_PACKAGE: "_DIGIT_PACKAGE",
        FIND_POSTING_SERVICE: "_FIND_POSTING_SERVICE",
    },
    AUDIO: src => `<audio src="${src}"/>`,

    START_APP_SOUND: 'https://s3-eu-west-1.amazonaws.com/alexasoundstrivia/sncf.mp3',
    WAIT_RESPONSE_SOUND: 'https://s3-eu-west-1.amazonaws.com/alexasoundstrivia/wait_sound.mp3',
    IMAGE_BACKGROUND_URL: 'http://www.galwaytourcompany.com/wp-content/uploads/2017/10/Connemara-Wild-Atlantic-Way.jpg',

    APP_ID: 'amzn1.ask.skill.0cd3418e-771a-4120-8120-d1dcdb6beaa1', // TODO replace with your app ID

    languageString: {
        "fr-FR": {
            translation: {
                //General
                EXIT_INSTRUCTIONS: ["Vous pouvez quitter l'application en disant 'Alexa quitte'. ", "Dites 'Alexa quitte' pour quitter l'application. "],
                UNHANDLE_MESSAGE: ["Je suis désolé, je n'ai pas compris ce que vous venez de dire. ", "Excusez moi je n'ai pas compris ce que vous avez dit. ",
                    "Je suis désolée je ne comprends pas ce que vous dites. ", "Excusez moi je ne comprends pas ce que vous venez de dire. ", "Je suis désolée je ne comprends pas. "],
                STOP_MESSAGE: ["Merci d'avoir utilisé notre application. J'espère vous revoir très bientôt. ", "Je vous remercie et à très vite. ",
                    "Je vous remercie pour votre utilisation et espère vous voir très vite. ", "Merci beaucoup et à bientôt. "],
                ASK_ACTION: ["Que souhaitez vous faire? ", "Quelle action voulez-vous faire ? ", "Quelle action voulez-vous exécuter ? "],
                CANCEL_MESSAGE: ["Très bien, retournons sur le menu. ", "Retournons sur le menu principal. ", "Pas de problème, retournons sur le menu. "],
                API_PROBLEM: ["Nous sommes désolé, le service est temporairement indisponible, réessayez plus tard. ",
                    "Nous sommes désolé, le service est temporairement indisponible. Nous vous demandons de réessayer plus tard. ",
                    "Nous sommes désolé, le service est actuellement indisponible. Veuillez réessayer plus tard. "],
                ASK_OTHER_ACTION: ["Quelle autre action souhaitez-vous effectuer ? ", "Quelle est la prochaine action à effectuer ? ",
                    "Voulez-vous faire autre chose ? ", "Désirez vous faire autre choses avec l'application ? "],
                WRONG_UNDERSTANDING_PACKAGE: ["Ah j'ai mal compris votre numéro de colis ? Recommençons ! Dites moi votre numéro de colis ou dites 'Annuler' pour retourner à l'accueil. ",
                    "Je suis désolée j'ai mal compris votre numéro de colis. Dites moi de nouveau votre numéro ou dites 'Annuler' pour retourner à l'accueil. ",
                    "Je n'ai pas compris votre numéro de colis. Veuillez le répéter ou dites 'Annuler' pour retourner à l'accueil. ",
                    "J'ai mal compris votre numéro de colis. Pouvez-vous le répéter ? Sinon dites 'Annuler' pour retourner à l'accueil. "],
                AMAZON_ERROR: "Je suis désolé mais Amazon rencontre actuellement des problèmes, veuillez réessayer plus tard. ",

                // startFlightHandler
                WELCOME_APP_MESSAGE: 'Bienvenue sur %s . ',
                APP_NAME: 'Posteet ',
                WELCOME_MESSAGE: 'Je vais vous aider avec les différents services de La Poste. ',
                REGISTER_PACKAGE: 'Vous pouvez enregistrer un colis. ',
                DELETE_PACKAGE: 'Vous pouvez supprimer un colis.',
                RETRIEVE_INFO_PACKAGE: "Vous pouvez savoir où se trouve un de vos colis enregistrés. ",
                OPTIONS_MESSAGE: 'Quel service souhaitez-vous demander? Vous pouvez enregistrer un colis ou bien retrouver un colis enregistré précédemment. ',
                HELP_MESSAGE_MENU: "Vous vous trouvez sur le menu de l'application. Vous pouvez faire ces différentes actions. ",
                FIND_POSTE: "Vous pouvez trouver le bureau de poste le plus proche en disant 'Alexa où se trouve le bureau le plus proche'. ",
                PRICE_PACKAGE: "Enfin, vous pouvez connaître le prix d'un colis. ",

                // Register Package Handler
                INIT_REGISTRATION: ['On va maintenant enregistrer votre colis. Veuillez me donner votre numéro de colis. ',
                    "Nous allons procéder à l'enregistrement d'un colis. Veuillez me donner son numéro. ",
                    "Nous allons faire l'enregistrement d'un colis. Veuillez me donner le numéro du colis. "],
                PACKAGE_REGISTERED: ["Parfait, j'ai enregistré votre colis. Vous pouvez dès à présent suivre votre colis en disant 'Alexa où en est mon colis'. ",
                    "Votre colis a bien été enregistré. Vous pouvez maintenant le suivre en disant 'Alexa où est mon colis'. ",
                    "J'ai bien enregistré le colis. Vous pouvez le suivre en disant 'Alexa où est mon colis'. ",
                    "Super le colis a été enregistré. Dites 'Alexa où est mon colis' pour le suivre. "],
                HELP_MESSAGE_REGISTER: "Vous devez donner le numéro de colis que vous souhaitez enregistrer. Pour cela commencez par donner le premier chiffre et la première lettre de votre colis. ",

                // Delete Package Handler
                INIT_DELETION: ['Veuillez me donner le numéro de colis que vous souhaitez supprimer. ', 'Donnez moi le numéro de colis que vous voulez supprimer. ',
                    'Dites moi le numéro de colis que vous voulez supprimer. ', 'Pouvez vous me dire quel numéro de colis souhaitez vous supprimer ? '],
                PACKAGE_DELETED: ["Votre colis a bien été supprimé. ", "J'ai bien supprimé votre colis. ", "Le colis vient d'être supprimé. ", "Le colis a été supprimé. "],
                PACKAGE_DOESNT_EXISTS: ["Votre colis n'existe pas. ", "Je suis désolée votre colis n'existe pas. ", "Le colis que vous avez mentionné n'existe pas. ",
                    "Je suis désolée le colis n'existe pas. "],
                PACKAGES_EMPTY: ["Vous n'avez aucun colis enregistré. ", "Je suis désolée vous n'avez aucun colis enregistré. ", "Aucun colis n'est encore enregistré. "],
                HELP_MESSAGE_DELETE: "Vous devez donner le numéro de colis que vous souhaitez supprimer. Pour cela commencez par donner le premier chiffre et la première lettre de votre colis. ",

                // Find Package Handler
                WRONT_TYPE: ["Le problème vient de chez nous et nous travaillons actuellement dessus. Merci de votre compréhension. ",
                    "Il y a un problème et nous sommes en train de le règler. Merci de votre compréhension. ",
                    "Un problème est apparu et nous essayons de le règler au plus vite. Nous vous remercions de votre compréhension. "],
                TRY_ANOTHER_PACKAGE_NUMBER: ["Essayez de donner un nouveau numéro de colis. ", "Veuillez donner un nouveau numéro pour le colis. ",
                    "Donnez un nouveau numéro pour le colis. ", "Veuillez donner un autre numéro de colis. "],
                ONE_PACKAGE_REGISTER: ["Vous avez actuellement un seul colis enregistré. ", "Un seul colis est enregistré. ", "Vous disposez d'un seul colis enregistré. "],
                MANY_PACKAGES_REGISTER: ["Vous avez actuellement plusieurs colis déjà enregistrés, je vais faire une recherche pour chaque colis. ",
                    "Vous disposez de plusieurs colis. Je vais faire une recherche pour chacun d'eux. ",
                    "Vous avez plusieurs colis disponibles. Je vais effectuer une recherche pour chaque colis. "],
                NO_PACKAGE_REGISTER: ["Vous n'avez pas de colis déjà enregistré, veuillez me donner le numéro de colis que je dois chercher. ",
                    "Il y a actuellement aucun colis enregistré. Veuillez me donner le numéro de colis que je dois chercher. ",
                    "Il n'y a aucun colis enregistré. Donnez moi le numéro de colis que je dois chercher. "],

                // Find Closest Posting Service Handler
                NOTIFY_MISSING_PERMISSIONS: "Je ne peux pas accéder à votre adresse. Veuillez le permettre depuis votre application Alexa ",
                NO_ADDRESS: "Il semblerait que vous n'ayez pas renseigné votre adresse. Vous pouvez le faire depuis votre application Alexa. ",
                DISTANCE_ERROR: "Je ne suis pas en capacité de fournir de distance pour le moment. Veuillez réessayer plus tard ",
                NEAREST_OFFICE_ADDRESS: "A l'adresse suivante : ",
                NEAREST_OFFICE_DISTANCE: "Le bureau de poste le plus proche est situé à ",

                // Digit Handler
                HELP_MESSAGE_DIGIT: "Vous devez donner les 4 prochains chiffres de votre commande. ",
                HELP_MESSAGE_NUMBER: "Vous devez donner les derniers chiffres de votre commande. ",
                HELP_MESSAGE_NUMBER_LETTER: "Vous devez donner le premier chiffre et la lettre de votre commande. ",

                // Price Package Handler
                HELP_MESSAGE_PRICE_PACKAGE: "Vous devez me donner le type de courrier que vous souhaitez envoyer ainsi que le poids que ce courrier fait afin que je puisse vous aider. ",
            }
        }
    }
}