/* global dhis2 */
angular.module('PEPFAR.dedupe').factory('periodService', periodService);

function periodService(Restangular, $q, $timeout, webappManifest, notify, dataStore) {
    var dependencies = [
        '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.min.js',
        '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.plus.min.js',
        '/dhis-web-commons/javascripts/dhis2/dhis2.period.js'
    ];
    var service = {
        getPastPeriodsRecentFirst: getPastPeriodsRecentFirst,
        setPeriodType: setPeriodType,
        isPeriodSettingISOFormat: isPeriodSettingISOFormat
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

    var datePattern = /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:(?:\.\d{3})?Z|\+00:00)$/;

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
        return dataStore.getPeriodSettings();
    }

    function hasPeriodSettings(periodSettings, resultsTargets) {
        return periodSettings && Object.keys(periodSettings).length && periodSettings[(resultsTargets || '').toUpperCase()];
    }

    function getPeriodSettings(periodSettings, resultsTargets) {
        return periodSettings[resultsTargets.toUpperCase()];
    }

    function getPeriod(periodType, periodIdentifier, yearDifferenceForPeriodGenerator) {
        var generatedPeriods;

        if (['Yearly', 'FinancialApril', 'FinancialJuly', 'FinancialOct'].indexOf(periodType) >= 0) {
            generatedPeriods = dhis2.period.generator.generatePeriods(periodType, yearDifferenceForPeriodGenerator + 5);
        } else {
            generatedPeriods = dhis2.period.generator.generatePeriods(periodType, yearDifferenceForPeriodGenerator);
        }

        return generatedPeriods
            .reduce(function (acc, period) {
                if (period.iso === periodIdentifier) {
                    return period;
                }
                return acc;
            }, undefined);
    }

    function getYearFromPeriodIdentifier(periodIdentifier) {
        return parseInt(periodIdentifier.slice(0, 4), 10);
    }

    function setPeriodType(periodType, resultsTargets, orgUnit) {
        var currentYear = new Date().getFullYear();

        return $q.all([calendarLoaded.promise, getDedupePeriodSettings()])
            .then(function (responses) {
                var periodSettingsResponse = responses[1];
                window.console.log('tom trying to do something');
                window.console.log('app dedupe filter: ' + orgUnit);

                if (_(periodTypes).contains(periodType) && hasPeriodSettings(periodSettingsResponse, resultsTargets)) {
                    var periodSettings = getPeriodSettings(periodSettingsResponse, resultsTargets);

                    generatedPeriods = Object.keys(periodSettings)
                        .filter(function (periodIdentifier) {
                            var periodSetting = periodSettings[periodIdentifier];

                            // Check if we have a start and end time
                            if (periodSetting && periodSetting.start && periodSetting.end &&
                                isPeriodSettingISOFormat(periodIdentifier, periodSetting)) {

                                var tempStart = periodSetting.start;
                                var tempEnd = periodSetting.end;

                                if (periodSetting.hasOwnProperty('operatingUnits')) {
                                    if (periodSetting.operatingUnits.hasOwnProperty(orgUnit)){
                                    
                                        tempStart = periodSetting['operatingUnits'][orgUnit]['start'];
                                        tempEnd = periodSetting['operatingUnits'][orgUnit]['end'];
                                                                               
                                   }        
                                }    


                                var timeStampForNow = Math.floor(Date.now());
                                var startDate = new Date(tempStart);
                                var endDate = new Date(tempEnd);

                                // Start date greater than end date
                                if (startDate.getTime() > endDate.getTime()) {
                                    window.console.warn('Skipping period settings ' + periodIdentifier + ', start' +
                                        ' date: ' + tempStart + ' greater than end date: ' + tempEnd);
                                    return false;
                                }

                                // We will only show periods that are open for dedupe
                                return (timeStampForNow > startDate.getTime() && timeStampForNow < endDate.getTime());
                            }

                            return false;
                        })
                        .map(function (periodIdentifier) {
                            var yearDifferenceForPeriodGenerator = getYearFromPeriodIdentifier(periodIdentifier) - currentYear;

                            return getPeriod(periodType, periodIdentifier, yearDifferenceForPeriodGenerator);
                        })
                        .filter(function (period) {
                            return period;
                        });

                    return periodSettings;
                }

                notify.warn('Could not find periodSettings for :' + periodType);
            });
    }

    function isPeriodSettingISOFormat(periodIdentifier, periodSetting) {
        var isValid = true;
        if (!datePattern.test(periodSetting.start)) {
            window.console.warn('Invalid start date format: ' + periodSetting.start);
            isValid = false;
        }
        if (!datePattern.test(periodSetting.end)) {
            window.console.warn('Invalid end date format: ' + periodSetting.end);
            isValid = false;
        }
        if (!isValid) {
            window.console.warn('Skipping period settings ' + periodIdentifier + '. Expected format:' +
                ' YYYY-MM-DDThh:mm:ss[.sss]Z or YYYY-MM-DDThh:mm:ss+00:00');
        }
        return isValid;
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
