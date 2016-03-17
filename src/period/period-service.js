/* global dhis2 */
angular.module('PEPFAR.dedupe').factory('periodService', periodService);

function periodService(Restangular, $q, $timeout, webappManifest, notify) {
    var dependencies = [
        '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.min.js',
        '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.plus.min.js',
        '/dhis-web-commons/javascripts/dhis2/dhis2.period.js'
    ];
    var service = {
        getPastPeriodsRecentFirst: getPastPeriodsRecentFirst,
        setPeriodType: setPeriodType
    };

    var calendarLoaded = $q.defer();
    var dependenciesLoaded = $q.defer();

    var generatedPeriods;

    var dateFormat = 'yyyy-mm-dd';
    var periodTypes = [
        'Daily',
        'Weekly',
        'Monthly',
        'BiMonthly',
        'Quarterly',
        'SixMonthly',
        'SixMonthlyApril',
        'Yearly',
        'FinancialApril',
        'FinancialJuly',
        'FinancialOct'
    ];

    var calendarType;
    var calendarTypes = [
        'coptic',
        'ethiopian',
        'islamic',
        'julian',
        'nepali',
        'thai'
    ];

    initialise();
    return service;

    function initialise() {
        jQuery.ajaxSetup({cache: true});
        loadDependencies()
            .finally(function () {
                jQuery.ajaxSetup({cache: false});
            });

        Restangular
            .all('system')
            .one('info')
            .get()
            .then(function (info) {
                dateFormat = info.dateFormat;

                if (info.calendar === 'iso8601') {
                    calendarType = 'gregorian';
                    prepareCalendar();
                } else {
                    calendarType = info.calendar;

                    if (_(calendarTypes).contains(calendarType)) {
                        loadCalendarScript(calendarType);
                    } else {
                        throw new Error('Calendar type "' + calendarType + '" is not supported.');
                    }
                }
            });
    }

    function loadDependencies() {
        if (dependencies.length === 0) {
            dependenciesLoaded.resolve();
        } else {
            loadScript(dependencies.shift())
                .then(loadDependencies)
                .catch(function (message) {
                    notify.error(message);
                    dependenciesLoaded.reject('Unable to load all the required dependencies');
                });
        }
        return dependenciesLoaded.promise;
    }

    function loadScript(url) {
        var deferred = $q.defer();
        jQuery.getScript(getScriptUrl(url), function () {
            deferred.resolve();
        }).error(function () {
            deferred.reject('Unable to load script: ' + url);
        });

        return deferred.promise;
    }

    function getScriptUrl(url) {
        return [webappManifest.activities.dhis.href, url].join('/').replace(/[^:](\/\/)/g, function (match) {
            return match.replace('//', '/');
        });
    }

    function prepareCalendar() {
        $q.when(dependenciesLoaded.promise)
            .then(function () {
                var calendar = jQuery.calendars.instance(getCalendarType());
                dhis2.period.generator = new dhis2.period.PeriodGenerator(calendar, getDateFormat());
                calendarLoaded.resolve(true);
            }, function () {
                calendarLoaded.reject();
            });
    }

    function getDateFormat() {
        return dateFormat;
    }

    function getCalendarType() {
        return calendarType;
    }

    function getPastPeriodsRecentFirst() {
        return generatedPeriods;
    }

    function getDedupePeriodSettings() {
        if (getDedupePeriodSettings.periodSettingsCache) {
            return getDedupePeriodSettings.periodSettingsCache;
        }

        getDedupePeriodSettings.periodSettingsCache = Restangular
            .all('dataStore')
            .all('dedupe')
            .get('periodSettings');

        return getDedupePeriodSettings.periodSettingsCache;
    }

    function hasPeriodSettings(periodSettings, resultsTargets) {
        return periodSettings && Object.keys(periodSettings).length && periodSettings[(resultsTargets || '').toLowerCase()];
    }

    function getPeriodSettings(periodSettings, resultsTargets) {
        return periodSettings[resultsTargets.toLowerCase()];
    }

    function getCurrentAndFuturePeriods(periodType, numberOfFuturePeriods) {
        if (['Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOct'].indexOf(periodType) >= 0) {
            return dhis2.period.generator.generatePeriods(periodType, 5)
                .filter(function (period, index) {
                    return (numberOfFuturePeriods || 0) >= index;
                });
        }

        function generateMore(periodType, i) {
            return periodsToReturn.concat(dhis2.period.generator.generatePeriods(periodType, i));
        }

        var periodsToReturn = [].concat(dhis2.period.generator.generatePeriods(periodType, 0));
        var yearsAheadGenerated = 0;

        function needsMorePeriods() {
            if (periodsToReturn.length - 1 >= 0) {
                return periodsToReturn.length - 1 < numberOfFuturePeriods;
            }
            return false;
        }

        while (needsMorePeriods()) {
            periodsToReturn = generateMore(periodType, yearsAheadGenerated += 1);
        }

        return periodsToReturn
            .filter(function (period, index) {
                return index <= numberOfFuturePeriods;
            });
    }

    function getPastPeriods(periodType, numberOfPastPeriods) {
        if (['Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOct'].indexOf(periodType) >= 0) {
            return dhis2.period.generator.generateReversedPeriods(periodType, -6)
                .filter(function (period, index) {
                    return ((numberOfPastPeriods > 0 ? numberOfPastPeriods : 0)) > index;
                })
                .reverse();
        }

        var periodsToReturn = [];
        var yearsAgoGenerated = 0;

        function needsMorePeriods() {
            return numberOfPastPeriods !== 0 && periodsToReturn.length < numberOfPastPeriods;
        }

        function generateMore(periodType, i) {
            return periodsToReturn.concat(dhis2.period.generator.generateReversedPeriods(periodType, i));
        }

        while (needsMorePeriods()) {
            periodsToReturn = generateMore(periodType, 0 - (yearsAgoGenerated += 1));
        }

        return periodsToReturn
            .filter(function (period, index) {
                return index < numberOfPastPeriods;
            })
            .reverse();
    }

    function setPeriodType(periodType, resultsTargets) {
        return $q.all([calendarLoaded.promise, getDedupePeriodSettings()])
            .then(function (responses) {
                var periodSettingsResponse = responses[1];

                if (_(periodTypes).contains(periodType) && hasPeriodSettings(periodSettingsResponse, resultsTargets)) {
                    var periodSettings = getPeriodSettings(periodSettingsResponse, resultsTargets);

                    generatedPeriods = []
                        .concat(
                            getPastPeriods(periodType, periodSettings.past),
                            getCurrentAndFuturePeriods(periodType, periodSettings.future)
                        )
                        .reverse();

                    return periodSettings;
                }
            });
    }

    function loadCalendarScript(calendarType) {
        jQuery.getScript('../dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.' + calendarType + '.min.js',
            function () {
                prepareCalendar();
            }).error(function () {
                throw new Error('Unable to load ' + calendarType + ' calendar');
            });

    }
}
