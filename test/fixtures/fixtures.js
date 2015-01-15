(function () {
    var fixtures = {};

    window.fixtures = {
        get: function (fixtureName) {
            if (fixtures[fixtureName]) {
                return angular.copy(fixtures[fixtureName]);
            }
            throw new Error('Fixture named "' + fixtureName + '" does not exist');
        }
    };

}(window));
