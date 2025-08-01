export const deckValidationSchemas = {
    deck_name: {
        isLength: {
            options: {
                min: 5,
                max: 10
            },
            errorMessage: 
                "Deck name must be between 5 and 11 letters"
            
        },
        isString: {
            errorMessage: 
                "Deck name must be string"
        },
        notEmpty: {
            errorMessage:
                "Deck name must not be empty"
        }
    },
    alternative: {
        optional: true,
        isString: {
            errorMessage:
                "The alternative deckname must be string"
        }
    },
    cards: {
        optional: true,
        isArray: true,
        isEmpty: true
    }

}

export const userValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 1,
                max: 10
            },
            errorMessage: 
                "username must be between 1 and 10 letters"
        },
        notEmpty: {
            errorMessage:
                "username must not be empty"
        },
        isString: {
            errorMessage: 
                "username must be string"
        }
    },
    displayname: {
        notEmpty: true
    },
    password: {
        notEmpty: true
    },
}

export const checkCardValidationSchemas = {
    filter: {
        isString: {
            errorMessage:
                "Card filter must be string"
        }
    },
    value: {
        isString: {
            errorMessage:
                "Card value must be string"
        },
        isLength: {
            options: {
                min: 1
            }
        }
    }
}

export const checkQuerryValidationSchemas = {
    filter: {
        isString: {
            errorMessage:
                "Filter must be string"
        }
    },
    value: {
        isLength: {
            options: {
                min: 1,
                max: 10
            },
            errorMessage: 
                "Must be between 5 and 10"
        }
    }
}
