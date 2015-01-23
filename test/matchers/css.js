beforeEach(function () {
    jasmine.addMatchers({
        toHaveClass: function () {
            return {
                compare: function (actual, className) {
                    var testResult = false;
                    var result = {
                        message: '',
                        pass: false
                    };
                    if (actual && actual.length > 1) {
                        return {
                            message: 'More than one element given',
                            pass: false
                        };
                    }
                    if (actual && actual.length && actual.length === 1) {
                        actual = actual[0];
                    }

                    testResult = typeof actual.classList === 'object' && actual.classList.contains(className);
                    if (testResult) {
                        result.pass = true;
                    } else {
                        result.message = 'Expected ' + actual + (testResult ? ' NOT' : '') + ' to have class "' + className + '"';
                        result.pass = false;
                    }

                    return result;
                }
            };
        },

        //TODO: This is not really a "CSS" assert
        toHaveAttribute: function () {
            return {
                compare: function (actual, attributeName) {
                    if (!(actual instanceof HTMLElement)) {
                        return {
                            message: 'Expected ' + actual + ' to be of type HTMLElement',
                            pass: false
                        };
                    }

                    var testResult = actual.attributes && actual.attributes[attributeName];
                    if (testResult) {
                        return {
                            pass: true
                        };
                    }
                    return {
                        message: 'Expected ' + actual + (testResult ? ' NOT' : '') + ' to have attribute "' + attributeName + '"',
                        pass: false
                    };
                }
            };
        }
    });
});
