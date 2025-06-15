export const checkValidationSchemas = {
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
        notEmpty: {
            errorMessage: 
                "Alternative name must not be empty"
        }
    }

}

export const checkCardQuerryValidationSchemas = {
    deckName: {
        isString: {
            errorMessage:
                "Deck name must be string"
        },
        isLength: {
            options: {
                min: 5,
                max: 10
            },
            errorMessage:
                "Deck name must be between 5 and 10 letters"
        }
    },
    card: {
        isLength: {
            options: {
                min: 1,
                max: 3
            },
            errorMessage:
                "Card must be between 1 and 3 digits"
        }
    }
}

export const checkQuerryValidationSchemas = {
    filter: {
        isString: {
            errorMessage:
                "Filter must be string"
        },
        isLength: {
            options: {
                min: 1,
                max: 10
            },
            errorMessage:
                "Must be between 1 and 10"
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
