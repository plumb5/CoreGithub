/*!
* jQuery QueryBuilder SQL Support
* Copyright 2014 Damien "Mistic" Sorel (http://www.strangeplanet.fr)
* Licensed under MIT (http://opensource.org/licenses/MIT)
*/

(function ($) {

    $.fn.queryBuilder.defaults.set({
        sqlOperators: {
            // sum:              'SUM ([?] as float ) as ?)',
            select: ',',
            equal: '= ?',
            not_equal: '!= ?',
            //  _in: { op: 'IN(?)', list: true },
            _in: { op: 'IN(?)', fn: function (v) { var k = ''; var a = ''; var arr = []; if (v.indexOf(",") != -1) { arr = v.split(","); for (var i = 0; i < arr.length; i++) { k += "'" + arr[i] + "',"; } } else { k = v; } if (k.indexOf(",") != -1) { var n = k.lastIndexOf(","); a = k.substring(0, n) } else { a = k; } return a; } },
            not_in: { op: 'NOT IN(?)', fn: function (v) { var k = ''; var a = ''; var arr = []; if (v.indexOf(",") != -1) { arr = v.split(","); for (var i = 0; i < arr.length; i++) { k += "'" + arr[i] + "',"; } } else { k = v; } if (k.indexOf(",") != -1) { var n = k.lastIndexOf(","); a = k.substring(0, n) } else { a = k; } return a; } },
            less: '< ?',
            less_or_equal: '<= ?',
            greater: '> ?',
            greater_or_equal: '>= ?',
            between: { op: 'BETWEEN ?', list: true, sep: ' AND ' },
            begins_with: { op: 'LIKE(?)', fn: function (v) { return v + '%'; } },
            not_begins_with: { op: 'NOT LIKE(?)', fn: function (v) { return v + '%'; } },
            like: { op: 'LIKE(?)', fn: function (v) { return '%' + v + '%'; } },
            not_like: { op: 'NOT LIKE(?)', fn: function (v) { return '%' + v + '%'; } },
            ends_with: { op: 'LIKE(?)', fn: function (v) { return '%' + v; } },
            not_ends_with: { op: 'NOT LIKE(?)', fn: function (v) { return '%' + v; } },
            is_empty: '= ""',
            is_not_empty: '!= ""',
            is_null: 'IS NULL',
            is_not_null: 'IS NOT NULL'
        }
    });

    $.extend($.fn.queryBuilder.constructor.prototype, {

        /**
        * Get rules as SQL query
        * @param stmt {false|string} use prepared statements - false, 'question_mark' or 'numbered'
        * @param nl {bool} output with new lines
        * @param data {object} (optional) rules
        * @return {object}
        */
        getSQL: function (stmt, nl, data) {
            data = (data === undefined) ? this.getRules() : data;
            stmt = (stmt === true || stmt === undefined) ? 'question_mark' : stmt;
            nl = (nl || nl === undefined) ? '\n' : ' ';

            var that = this,
                bind_index = 1,
                bind_params = [];

            var sql = (function parse(data) {
                if (!data.condition) {
                    data.condition = that.settings.default_condition;
                }
                if (['AND', 'OR'].indexOf(data.condition.toUpperCase()) === -1) {
                    $.error('Unable to build SQL query with ' + data.condition + ' condition');
                }

                if (!data.rules) {
                    return '';
                }

                var parts = [];

                $.each(data.rules, function (i, rule) {
                    if (rule.rules && rule.rules.length > 0) {
                        parts.push('(' + nl + parse(rule) + nl + ')' + nl);
                    }
                    else {
                        var sql = that.getSqlOperator(rule.operator),
                            ope = that.getOperatorByType(rule.operator),
                            value = '';

                        if (sql === false) {
                            $.error('SQL operation unknown for operator ' + rule.operator);
                        }

                        if (ope.accept_values) {
                            if (!(rule.value instanceof Array)) {
                                rule.value = [rule.value];
                            }
                            else if (!sql.list && rule.value.length > 1) {
                                $.error('Operator ' + rule.operator + ' cannot accept multiple values');
                            }

                            rule.value.forEach(function (v, i) {
                                if (i > 0) {
                                    value += ' AND ';
                                }

                                if (rule.type == 'integer' || rule.type == 'double') {
                                    v = changeType(v, rule.type);
                                }
                                else if (!stmt) {
                                    v = escapeString(v);
                                }

                                v = sql.fn(v);

                                if (stmt) {
                                    if (stmt == 'question_mark') {
                                        value += '?';
                                    }
                                    else {
                                        value += '$' + bind_index;
                                    }

                                    bind_params.push(v);
                                    bind_index++;
                                }
                                else {
                                    if (typeof v === 'string') {
                                        v = '\'' + v + '\'';
                                    }

                                    value += v;
                                }
                            });
                        }

                        parts.push(rule.field + ' ' + sql.op.replace(/\?/, value));
                    }
                });

                return parts.join(' ' + data.condition + nl);
            }(data));

            if (stmt) {
                return {
                    sql: sql,
                    params: bind_params
                };
            }
            else {
                return {
                    sql: sql
                };
            }
        },

        /**
        * Sanitize the "sql" field of an operator
        * @param sql {string|object}
        * @return {object}
        */
        getSqlOperator: function (type) {
            var sql = this.settings.sqlOperators[type];

            if (sql === undefined) {
                return false;
            }

            if (typeof sql === 'string') {
                sql = { op: sql };
            }
            if (!sql.fn) {
                sql.fn = passthru;
            }
            if (!sql.list) {
                sql.list = false;
            }

            return sql;
        }
    });


    /**
    * Does nothing !
    */
    function passthru(v) {
        return v;
    }

    /**
    * Change type of a value to int or float
    * @param value {mixed}
    * @param type {string}
    * @return {mixed}
    */
    function changeType(value, type) {
        switch (type) {
            case 'integer': return parseInt(value);
            case 'double': return parseFloat(value);
            default: return value;
        }
    }

    /**
    * Escape SQL value
    * @param value {string}
    * @return {string}
    */
    function escapeString(value) {
        if (typeof value !== 'string') {
            return value;
        }

        return value
          .replace(/[\0\n\r\b\\\'\"]/g, function (s) {
              switch (s) {
                  case '\0': return '\\0';
                  case '\n': return '\\n';
                  case '\r': return '\\r';
                  case '\b': return '\\b';
                  default: return '\\' + s;
              }
          })
        // uglify compliant
          .replace(/\t/g, '\\t')
          .replace(/\x1a/g, '\\Z');
    }

}(jQuery));