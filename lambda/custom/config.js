module.exports = {
    DYNAMODB_TABLE: 'Posteet',
    LAPOSTE_API_KEY: 'zchl9IRQIeGObF+kw+s4nD4h+d6pJKqgGMwJtT7KFJs/sGa4p1ljEh8hU1zwNcaV',
    DISTANCE_API_KEY: 'DOW3yIozsh0EobJtzvPwP5AzbSMP0YrS',

    APP_STATES: {
        START: "_START", // Entry point, start the skill.
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

    APP_ID: 'amzn1.ask.skill.8589531b-402f-4178-8202-ba354200d2c3', // TODO replace with your app ID

    languageString: {
        "fr-FR": {
            translation: {
                //General
                EXIT_INSTRUCTIONS: ["Vous pouvez quitter la skill en disant 'Alexa quitte'. ", "Dites 'Alexa quitte' pour quitter la skill. "],
                UNHANDLE_MESSAGE: ["Je suis désolée, je n'ai pas compris ce que vous venez de dire. ", "Excusez moi je n'ai pas compris ce que vous avez dit. ",
                    "Je suis désolée je ne comprends pas ce que vous dites. ", "Je suis désolée je ne comprends pas. "],
                STOP_MESSAGE: ["Merci d'avoir utilisé notre skill. J'espère vous revoir très bientôt. ", "Je vous remercie et à très vite. ",
                    "Je vous remercie pour votre utilisation et espère vous voir très vite. ", "Merci beaucoup et à bientôt. "],
                ASK_ACTION: ["Que souhaitez vous faire? ", "Quelle action voulez-vous faire ? ", "Quelle action voulez-vous exécuter ? "],
                CANCEL_MESSAGE: ["Très bien, retournons sur le menu. ", "Retournons sur le menu principal. ", "Pas de problème, retournons sur le menu. "],
                API_PROBLEM: ["Nous sommes désolés, le service la poste est temporairement indisponible, réessayez plus tard. Au revoir. ",
                    "Nous sommes désolés, le service la poste est temporairement indisponible. Nous vous demandons de réessayer plus tard. A bientôt. ",
                    "Nous sommes désolés, le service la poste est actuellement indisponible. Veuillez réessayer plus tard. Au revoir. "],
                ASK_OTHER_ACTION: ["Quelle autre action souhaitez-vous effectuer ? ", "Quelle est la prochaine action à effectuer ? ",
                    "Que voulez-vous faire maintenant ? "],
                WRONG_UNDERSTANDING_PACKAGE: ["Ah j'ai mal compris votre numéro de colis ? ",
                    "Je suis désolée j'ai mal compris votre numéro de colis. ",
                    "Je n'ai pas compris votre numéro de colis. ",
                    "J'ai mal compris votre numéro de colis. "],
                AMAZON_ERROR: "Je suis désolée mais Amazon rencontre actuellement des problèmes, veuillez réessayer plus tard. ",
                REPEAT_MESSAGE: ["Très bien, je vais répéter. ", "Je répète. "],

                // startFlightHandler
                WELCOME_APP_MESSAGE: 'Bienvenue sur %s . ',
                APP_NAME: 'Posteet ',
                WELCOME_MESSAGE: 'Je vais vous aider avec les différents services de La Poste. ',
                REGISTER_PACKAGE: 'Vous pouvez enregistrer un colis de type colissimo. ',
                DELETE_PACKAGE: 'Vous pouvez supprimer un colis. ',
                RETRIEVE_INFO_PACKAGE: "Vous pouvez savoir où se trouve un de vos colis enregistrés. ",
                START_REPROMPT_MESSAGE: "Vous pouvez dire par exemple 'Alexa enregistre un colis' ou encore 'Quel est le prix d'une lettre ?'. ", // 'Alexa où se trouve le bureau de poste le plus proche'
                HELP_MESSAGE_MENU: "Vous vous trouvez sur le menu de la skill. Vous pouvez faire ces différentes actions. ",
                //FIND_POSTE: "Vous pouvez trouver le bureau de poste le plus proche de chez vous. ",
                PRICE_PACKAGE: "Enfin, vous pouvez connaître le prix d'un colis. ",
                ASK_MENU: "Que voulez-vous faire? ",

                // Register Package Handler
                INIT_REGISTRATION: ['On va maintenant enregistrer votre colis colissimo. Veuillez me donner le premier chiffre et la première lettre de votre numéro de colis. ',
                    "Nous allons procéder à l'enregistrement d'un colis colissimo. Veuillez me donner son premier chiffre et sa première lettre. ",
                    "Nous allons faire l'enregistrement d'un colis colissimo. Veuillez me donner le premier chiffre et la première lettre de votre numéro de colis. "],
                PACKAGE_REGISTERED: ["Parfait, j'ai enregistré votre colis. Vous pouvez dès à présent suivre votre colis en disant 'Alexa où en est mon colis'. ",
                    "Votre colis a bien été enregistré. Vous pouvez maintenant le suivre en disant 'Alexa où est mon colis'. ",
                    "J'ai bien enregistré le colis. Vous pouvez le suivre en disant 'Alexa où est mon colis'. ",
                    "Super le colis a été enregistré. Dites 'Alexa où est mon colis' pour le suivre. "],
                HELP_MESSAGE_REGISTER: "Vous devez donner le numéro de colis que vous souhaitez enregistrer. Pour cela commencez par donner le premier chiffre et la première lettre de votre colis. Si ce n'est pas ce que vous souhaitiez, vous pouvez dire 'Alexa annule' pour retourner au menu et vous pouvez quitter la skill 'Alexa, quitte'. ",
                REGISTER_REPROMPT_MESSAGE: "Donnez moi le premier chiffre et la première lettre de votre colis. ",
                END_REGISTER_REPROMPT_MESSAGE: "Pour connaître l'état de votre nouveau colis enregistré dites : 'Alexa où en est mon colis'. Demandez moi de l'aide si vous souhaitez plus d'informations sur les différentes fonctionnalités disponibles. ",

                // Delete Package Handler
                INIT_DELETION: ['Veuillez me donner le numéro de colis que vous souhaitez supprimer. Commencez par le premier chiffre et la première lettre. ', 'Donnez moi le premier chiffre et la première lettre du colis à supprimer. ',
                    'Dites moi le numéro de colis que vous voulez supprimer. Commencez par le premier chiffre et la première lettre. ', 'Pouvez vous me dire quel numéro de colis souhaitez vous supprimer ? Donnez moi le premier chiffre et la première lettre. '],
                PACKAGE_DELETED: ["Votre colis a bien été supprimé. ", "J'ai bien supprimé votre colis. ", "Le colis vient d'être supprimé. ", "Le colis a été supprimé. "],
                PACKAGE_DOESNT_EXISTS: ["Votre colis n'existe pas. ", "Je suis désolée votre colis n'existe pas. ", "Le colis que vous avez mentionné n'existe pas. ",
                    "Je suis désolée le colis n'existe pas. "],
                PACKAGES_EMPTY: ["Vous n'avez aucun colis enregistré. ", "Je suis désolée vous n'avez aucun colis enregistré. ", "Aucun colis n'est encore enregistré. "],
                HELP_MESSAGE_DELETE: "Vous devez donner le numéro de colis que vous souhaitez supprimer. Pour cela commencez par donner le premier chiffre et la première lettre de votre colis. Vous pouvez aussi à tout moment retourner au menu en disant 'Alexa annuler' ou quitter l'application en disant 'Alexa quitte'. ",
                DELETE_REPROMPT_MESSAGE: "Donnez moi le premier chiffre et la première lettre de votre colis à supprimer. ",
                DELETE_IMPOSSIBLE: "Je ne peux pas supprimer de colis car vous n'avez pas de colis enregistrés actuellement. Voici les actions que vous pouvez effectuer: ",

                // Find Package Handler
                WRONG_TYPE: ["Colis : %s <break time=\"0.5s\"/>. Ce colis ne correspond pas à un colis colissimo. ",
                    "Le colis %s n'est pas un numéro de colis valide. ",
                    "Un colis colissimo doit contenir un chiffre, une lettre puis onze chiffres. Le colis %s n'est pas du bon format. "],
                TRY_ANOTHER_PACKAGE_NUMBER: ["Essayez de donner un nouveau numéro de colis. ", "Veuillez donner un nouveau numéro pour le colis. ",
                    "Donnez un nouveau numéro pour le colis. ", "Veuillez donner un autre numéro de colis. "],
                ONE_PACKAGE_REGISTER: ["Vous avez actuellement un seul colis enregistré. ", "Un seul colis est enregistré. ", "Vous disposez d'un seul colis enregistré. "],
                MANY_PACKAGES_REGISTER: ["Vous avez actuellement plusieurs colis déjà enregistrés. Laissez moi un instant, je vais faire une recherche pour chaque colis. ",
                    "Vous disposez de plusieurs colis. Laissez moi un instant, je vais faire une recherche pour chacun d'eux. ",
                    "Vous avez plusieurs colis disponibles. Laissez moi un instant afin de rechercher l'état de chaque colis. "],
                NO_PACKAGE_REGISTER: ["Vous n'avez pas de colis déjà enregistré, vous devez en enregistré un afin de pouvoir savoir où il se trouve. ",
                    "Il y a actuellement aucun colis enregistré. Veuillez enregistrer un numéro de colis afin de pouvoir savoir où il se trouve. ",
                    "Il n'y a aucun colis enregistré. Vous pouvez enregistrer un colis et ensuite me demander où il se trouve si vous le souhaitez. "],

                // Find Closest Posting Service Handler
                /* UNCOMMENT WHEN IMPLEMENTING BACK THE POSTING 
                NOTIFY_MISSING_PERMISSIONS: "Je ne peux pas accéder à votre adresse. Veuillez le permettre depuis votre skill Alexa ",
                NO_ADDRESS: "Il semblerait que vous n'ayez pas renseigné votre adresse. Vous pouvez le faire depuis votre skill Alexa. ",
                DISTANCE_ERROR: "Je ne suis pas en capacité de fournir de distance pour le moment. Veuillez réessayer plus tard ",
                NEAREST_OFFICE_ADDRESS: "A l'adresse suivante : ",
                NEAREST_OFFICE_DISTANCE: "Le bureau de poste le plus proche est situé à ",
                NEAREST_OFFICE: "Le bureau de poste le plus proche est situé au ",
                NO_NEAREST_OFFICE: "Je suis désolée mais je n'ai pas pu trouver le bureau de poste le plus proche. Votre adresse est peut être incomplète, vous pouvez la modifier depuis votre skill Alexa. ",
*/
                // Digit Handler
                HELP_MESSAGE_DIGIT: "Vous devez donner les 4 prochains chiffres de votre commande. Vous pouvez à tout moment retourner au menu en disant 'Alexa annuler' ou quitter l'application en disant 'Alexa quitte'. ",
                HELP_MESSAGE_NUMBER: "Vous devez donner les derniers chiffres de votre commande. Vous pouvez à tout moment retourner au menu en disant 'Alexa annuler' ou quitter l'application en disant 'Alexa quitte'. ",
                HELP_MESSAGE_NUMBER_LETTER: "Vous devez donner le premier chiffre et la lettre de votre commande. Vous pouvez à tout moment retourner au menu en disant 'Alexa annuler' ou quitter l'application en disant 'Alexa quitte'. ",
                FIRST_INSTRUCTION_REPROMPT_MESSAGE: "Donnez moi le premier numéro et la première lettre de votre colis s'il vous plait. ",
                DIGIT_INSTRUCTIONS: ["Parfait ! Quels sont les 4 premiers numéros ? ", "Continuons maintenant avec les 4 prochains numéros. ", "C'est bientôt fini. Donnez moi les derniers numéros du colis. "],
                DIGIT_INSTRUCTIONS_REPROMPT_MESSAGE: ["Quels sont les 4 premiers numéros ? ", "Quels sont les 4 numéros maintenant ? ", "Quels sont les derniers numéros ? "],

                // Price Package Handler
                HELP_MESSAGE_PRICE_PACKAGE: "Vous devez me donner le type de courrier que vous souhaitez envoyer ainsi que le poids que ce courrier fait afin que je puisse vous aider. Quel type de courrier et quel poids souhaitez-vous connaitre ? ",
                PRICE_REPROMPT_MESSAGE: "Donnez moi le type ou le poids du courrier donc vous souhaitez connaître le prix. ",
            }
        }
    }
}