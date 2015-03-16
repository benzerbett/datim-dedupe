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

    function setPeriodType(periodType) {
        return calendarLoaded.promise.then(function () {
            if (_(periodTypes).contains(periodType)) {
                var d2peGen = dhis2.period.generator;
                generatedPeriods = d2peGen.filterFuturePeriodsExceptCurrent(d2peGen.generateReversedPeriods(periodType, 0));

                if (/Quarterly/.test(periodType)) {
                    var additionalYearsToGenerate = 3;
                    var i;
                    for (i = 0; i >= (0 - additionalYearsToGenerate); i -= 1) {
                        generatedPeriods = generatedPeriods.concat(d2peGen.generateReversedPeriods(periodType, i));
                    }
                }
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
