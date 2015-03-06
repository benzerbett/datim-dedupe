angular.module('PEPFAR.dedupe').factory('dedupeRecordService', dedupeRecordService);

function dedupeRecordService($q, Restangular, DEDUPE_MECHANISM_NAME) {
    var headers;

    return {
        getRecords: getRecords
    };

    function getRecords(filters) {
        return executeSqlViewOnApi(filters)
            .then(extractHeaders)
            .then(createDedupeRecords);
    }

    function extractHeaders(sqlViewData) {
        headers = _.chain(sqlViewData.headers)
            .map(_.compose(_.values, _.partialRight(_.pick, ['column'])))
            .flatten()
            .value();

        return sqlViewData.rows;
    }

    function executeSqlViewOnApi(filters) {
        var queryParameters = {var: getFilterArrayFromFilters(filters)};

        return getSqlViewIdFromSystemSettings()
            .then(function (sqlViewId) {
                window.console.log(queryParameters);
                window.console.log(sqlViewId);

                /* jscs:disable */
                return {
                    title: 'DEDUPLICATION_Demoland',
                    headers: [{
                        name: 'oulevel2_name',
                        column: 'oulevel2_name',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'oulevel3_name',
                        column: 'oulevel3_name',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'oulevel4_name',
                        column: 'oulevel4_name',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'oulevel5_name',
                        column: 'oulevel5_name',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'orgunit_name',
                        column: 'orgunit_name',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'orgunit_level',
                        column: 'orgunit_level',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'iso_period',
                        column: 'iso_period',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'dataelement',
                        column: 'dataelement',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'disaggregation',
                        column: 'disaggregation',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'agency',
                        column: 'agency',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'mechanism',
                        column: 'mechanism',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'partner',
                        column: 'partner',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'value',
                        column: 'value',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'duplicate_type',
                        column: 'duplicate_type',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'duplicate_status',
                        column: 'duplicate_status',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'ou_uid',
                        column: 'ou_uid',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'de_uid',
                        column: 'de_uid',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'coc_uid',
                        column: 'coc_uid',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'group_id',
                        column: 'group_id',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'group_count',
                        column: 'group_count',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'total_groups',
                        column: 'total_groups',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }, {
                        name: 'dataset_type',
                        column: 'dataset_type',
                        type: 'java.lang.String',
                        hidden: false,
                        meta: false
                    }],
                    rows: [
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'HTC_TST (N, DSD): HTC received results', '(default)', 'USAID', '(1002 Demoland USAID Cardinal IM)', 'Demoland Cardinal IP', '23', 'CROSSWALK', 'UNRESOLVED', 'HfiOUYEPgLK', 'K6f6jR0NOcZ', 'HllvX50cXC0', '2364f5b15e57185fc6564ce64cc9c629', (filters.pg || 1), '243', 'RESULTS'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'HTC_TST (N, DSD): HTC received results', '(default)', 'USAID', '(9999 Demoland USAID IM)', 'Demoland Demoland USAID IP', '2500', 'CROSSWALK', 'UNRESOLVED', 'HfiOUYEPgLK', 'K6f6jR0NOcZ', 'HllvX50cXC0', '2364f5b15e57185fc6564ce64cc9c629'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD): Receiving ART', '(default)', 'USAID', '(9999 Demoland USAID IM)', 'Demoland Demoland USAID IP', '900', 'CROSSWALK', 'UNRESOLVED', 'HfiOUYEPgLK', 'OuudMtJsh2z', 'HllvX50cXC0', '2364f5b15e57185fc6564ce64cc9c629'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD): Receiving ART', '(default)', 'USAID', '(1009 Demoland USAID Owl IM)', 'Demoland Owl IP', '100', 'CROSSWALK', 'UNRESOLVED', 'HfiOUYEPgLK', 'OuudMtJsh2z', 'HllvX50cXC0', '2364f5b15e57185fc6564ce64cc9c629'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD): Receiving ART', '(default)', 'USAID', '(1030 Demoland USAID Perch IM)', 'Demoland Perch IP', '100', 'CROSSWALK', 'UNRESOLVED', 'HfiOUYEPgLK', 'OuudMtJsh2z', 'HllvX50cXC0', '2364f5b15e57185fc6564ce64cc9c629'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(15+, Female)', 'USAID', '(1009 Demoland USAID Owl IM)', 'Demoland Owl IP', '11', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'TbYpjxM5j6w', 'dd978a42a0fa04a0441e88bac3e394b8'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(15+, Female)', 'USAID', '(1030 Demoland USAID Perch IM)', 'Demoland Perch IP', '3', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'TbYpjxM5j6w', 'dd978a42a0fa04a0441e88bac3e394b8'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(15+, Male)', 'USAID', '(1009 Demoland USAID Owl IM)', 'Demoland Owl IP', '22', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'm8x88iYhmwQ', 'eda63f5fa49d669f665172b4ffdab8bd'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(15+, Male)', 'USAID', '(1030 Demoland USAID Perch IM)', 'Demoland Perch IP', '30', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'm8x88iYhmwQ', 'eda63f5fa49d669f665172b4ffdab8bd'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(<15, Female)', 'USAID', '(1009 Demoland USAID Owl IM)', 'Demoland Owl IP', '12', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'fut2YHUHJWD', '846695851799a4e285d554399e12ce32'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(<15, Female)', 'USAID', '(1030 Demoland USAID Perch IM)', 'Demoland Perch IP', '10', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'fut2YHUHJWD', '846695851799a4e285d554399e12ce32'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(<15, Male)', 'USAID', '(1009 Demoland USAID Owl IM)', 'Demoland Owl IP', '23', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'NN3gA5T8q1g', '665b83bbeac727a52dde7ace81962477'],
                        ['Animal Region', 'Bird District', 'Cardinal Site', '', 'Cardinal Site', '6', '2013Oct', 'TX_CURR (N, DSD, Age/Sex Aggregated): Receiving ART', '(<15, Male)', 'USAID', '(1030 Demoland USAID Perch IM)', 'Demoland Perch IP', '20', 'PURE', 'UNRESOLVED', 'HfiOUYEPgLK', 'H9Q2jDZ76ih', 'NN3gA5T8q1g', '665b83bbeac727a52dde7ace81962477'],
                        ['', '', '', '', 'Demoland', '3', '2013Oct', 'BS_COLL (N, TA): Blood Units Donated', '(default)', 'USAID', '(1028 Demoland USAID Dory IM)', 'Demoland Dory IP', '114', 'PURE', 'RESOLVED', 'KKFzPM8LoXs', 'ASaP3A4Y416', 'HllvX50cXC0', 'afcef7095828ad05ff593d21e336bbfe'],
                        ['', '', '', '', 'Demoland', '3', '2013Oct', 'BS_COLL (N, TA): Blood Units Donated', '(default)', 'USAID', '(1007 Demoland USAID Hawk IM)', 'Demoland Hawk IP', '10', 'PURE', 'RESOLVED', 'KKFzPM8LoXs', 'ASaP3A4Y416', 'HllvX50cXC0', 'afcef7095828ad05ff593d21e336bbfe'],
                        ['', '', '', '', 'Demoland', '3', '2013Oct', 'BS_COLL (N, TA): Blood Units Donated', '(default)', 'USAID', '(1009 Demoland USAID Owl IM)', 'Demoland Owl IP', '12', 'PURE', 'RESOLVED', 'KKFzPM8LoXs', 'ASaP3A4Y416', 'HllvX50cXC0', 'afcef7095828ad05ff593d21e336bbfe'],
                        ['', '', '', '', 'Demoland', '3', '2013Oct', 'BS_COLL (N, TA): Blood Units Donated', '(default)', 'USAID', '(1001 Demoland USAID Parrot IM)', 'Demoland Parrot IP', '123', 'PURE', 'RESOLVED', 'KKFzPM8LoXs', 'ASaP3A4Y416', 'HllvX50cXC0', 'afcef7095828ad05ff593d21e336bbfe'],
                        ['', '', '', '', 'Demoland', '3', '2013Oct', 'BS_COLL (N, TA): Blood Units Donated', '(default)', 'USAID', '(00000 De-duplication adjustment)', 'Demoland Parrot IP', '123', 'PURE','RESOLVED','KKFzPM8LoXs', 'ASaP3A4Y416', 'HllvX50cXC0', 'afcef7095828ad05ff593d21e336bbfe']
                    ],
                    width: 22,
                    height: 17
                };
                /* jscs:enable */

                //return Restangular.all('sqlViews')
                //    .all(sqlViewId)
                //    .get('data', queryParameters);
            });
    }

    function getSqlViewIdFromSystemSettings() {
        return Restangular.all('systemSettings').withHttpConfig({cache: true})
            .get('keyDedupeSqlViewId')
            .then(function (settingsObject) {
                if (settingsObject && angular.isString(settingsObject.id)) {
                    return settingsObject.id;
                }

                return $q.reject('System setting with id of sqlview not found. Please check if your app is configured correctly.');
            });
    }

    function getFilterArrayFromFilters(filters) {
        return _.map(filters, function (value, key) {
            return [key, value].join(':');
        });
    }

    function createDedupeRecords(rows) {
        var totalNumber;
        var pageNumber;

        var dedupeRecords = _.chain(rows)
            .tap(function (rows) {
                if (rows.length > 0) {
                    totalNumber = getColumnValue('total_groups', rows[0]);
                    pageNumber = getColumnValue('group_count', rows[0]);
                }
            })
            .groupBy(recordGroupIdentifier)
            .values()
            .map(createDedupeRecord)
            .value();

        dedupeRecords.pageNumber = parseInt(pageNumber, 10);
        dedupeRecords.totalNumber = parseInt(totalNumber, 10);

        return dedupeRecords;
    }

    function createDedupeRecord(rows) {
        var dedupeRecord = {
            id: getColumnValue('group_id', rows[0]),
            details: {
                orgUnitId: getColumnValue('ou_uid', rows[0]),
                orgUnitName: getColumnValue('orgunit_name', rows[0]),
                timePeriodName: getColumnValue('iso_period', rows[0]),
                dataElementId: getColumnValue('de_uid', rows[0]),
                dataElementName: getColumnValue('dataelement', rows[0]),
                disaggregation: getColumnValue('disaggregation',  rows[0]),
                categoryOptionComboId: getColumnValue('coc_uid', rows[0]),
                categoryOptionComboName: getColumnValue('disaggregation', rows[0]),
                type: getColumnValue('duplicate_type', rows[0])
            },
            data: [],
            resolve: {
                isResolved: isResolved(rows),
                type: undefined,
                value: undefined
            }
        };

        if (isResolved(rows)) {
            dedupeRecord.resolve.type = getDedupeType(rows);
            dedupeRecord.resolve.value = calculateActualDedupedValue(rows);
        }

        getNonDedupeRows(rows).forEach(processRecord(dedupeRecord));

        return dedupeRecord;
    }
    function processRecord(dedupeRecord) {
        return function (record) {
            //var mechanism = getColumnValue('mechanism', record);
            var partnerName = getColumnValue('partner', record);
            var agencyName = getColumnValue('agency', record);
            var value = getColumnValue('value', record);

            dedupeRecord.data.push({
                agency: agencyName,
                partner: partnerName,
                value: parseFloat(value)
            });
        };
    }

    function isResolved(dataRows) {
        return dataRows.some(isDedupeMechanismRow) && dataRows.every(function (row) {
                return (getColumnValue('duplicate_status', row) === 'RESOLVED');
            });
    }

    function getDedupeType(dataRows) {
        switch (calculateActualDedupedValue(dataRows)) {
            case getTotalOfAllNonDedupeRows(dataRows):
                return 'sum';
            case getMaxOfAllNonDedupedRows(dataRows):
                return 'max';
        }
        return 'custom';
    }

    function calculateActualDedupedValue(dataRows) {
        return getTotalOfAllNonDedupeRows(dataRows) + getDedupeAdjustmentValue(dataRows);
    }

    function recordGroupIdentifier(record) {
        return getColumnValue('group_id', record);
    }

    function getColumnValue(columnName, record) {
        var columnIndex = headers.indexOf(columnName);

        return columnIndex >= 0 ? record[columnIndex] : undefined;
    }

    function getDedupeAdjustmentValue(dataRows) {
        var dedupeAdjustmentRow = _.chain(dataRows)
            .filter(isDedupeMechanismRow)
            .map(pickValueColumn)
            .value();

        if (dedupeAdjustmentRow.length > 1) { throw new Error('More than 1 dedupe adjustment row found'); }

        return dedupeAdjustmentRow.reduce(add, 0);
    }

    function getTotalOfAllNonDedupeRows(dataRows) {
        return _.chain(getNonDedupeRows(dataRows))
            .map(pickValueColumn)
            .reduce(add, 0)
            .value();
    }

    function getMaxOfAllNonDedupedRows(dataRows) {
        var rowValues = _.chain(getNonDedupeRows(dataRows))
            .map(pickValueColumn)
            .value();

        return Math.max.apply(Math, rowValues);
    }

    function getNonDedupeRows(dataRows) {
        return _.chain(dataRows)
            .reject(isDedupeMechanismRow)
            .value();
    }

    function isDedupeMechanismRow(row) {
        return getColumnValue('mechanism', row) === DEDUPE_MECHANISM_NAME;
    }

    function pickValueColumn(row) {
        return parseFloat(getColumnValue('value', row));
    }

    function add(left, right) {
        return left + right;
    }
}
