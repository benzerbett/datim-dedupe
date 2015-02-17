/* global dhis2 */
angular.module('PEPFAR.dedupe').factory('periodService', periodService);

function periodService(Restangular, $q, $timeout) {
    var service = {
        getPastPeriodsRecentFirst: getPastPeriodsRecentFirst,
        setPeriodType: setPeriodType
    };

    var calendarLoaded = $q.defer();

    var currentPeriodType;
    var generatedPeriods;
    var calendarType;
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
                    }
                }
            });
    }

    function prepareCalendar() {
        try {
            var calendar = jQuery.calendars.instance(getCalendarType());
            dhis2.period.generator = new dhis2.period.PeriodGenerator(calendar, getDateFormat());
            calendarLoaded.resolve(true);
        } catch (e) {
            prepareCalendar.count += 1;

            if (prepareCalendar.count > 100) {
                calendarLoaded.reject(false);
            } else {
                $timeout(prepareCalendar, 100);
            }
        }
    }
    prepareCalendar.count = 0;

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
                var periods;
                currentPeriodType = periodType;
                periods = dhis2.period.generator.generateReversedPeriods(currentPeriodType, 0);
                generatedPeriods = dhis2.period.generator.filterFuturePeriodsExceptCurrent(periods);

                window.console.log(generatedPeriods);
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
