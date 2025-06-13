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
export const checkQuerryValidationSchemas = {
    filter: {
        optional: true,
        isString: {
            errorMessage:
                "Filter must be string"
        }
    },
    value: {
        optional: true,
        isString: {
            errorMessage:
                "Filter value must be string"
        },
        isLength: {
            min: 1,
            max: 10
        }
    }
}
