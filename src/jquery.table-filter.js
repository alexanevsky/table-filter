/*!
 * jQuery Table Filter v1.0.0
 * https://github.com/alexanevsky/table-filter
 *
 * Copyright 2020 Alexanevsky (https://lashchevsky.me)
 *
 * Released under the MIT license.
 *
 * Date: 2020-07-10
 */

 /*
 * TOC
 *
 * Define variables
 * - Define defaults
 * Define plugin
 * Prototypes
 * - Init
 * -- Define variables
 * -- Check length
 * -- Construct search
 * -- Handler
 * - Filter
 * Register plugin
 */

 ;(function(factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory); // AMD
    }
    else if (typeof exports === 'object') {
        module.exports = factory($ || require('jquery')); // CommonJS
    }
    else {
        factory(jQuery);
    }
}(function($) {
    'use strict';

    // > Define variables
    var pluginName = 'tableFilter';

    // >> Define defaults
    var defaults = {
        class:          null,
        style:          null,
        placeholder:    'Search...',
        type:           'text',
        inCols:         [],
        excludeCols:    [],
        min:            10
    }

    // > Define plugin
    function TableFilter(table, options) {
        this.table = table;
        this.options = $.extend({}, defaults, options, table.dataset);

        if (typeof this.options.inCols === 'string') {
            this.options.inCols = this.options.inCols.split(',').map(Number);
        }

        if (typeof this.options.excludeCols === 'string') {
            this.options.excludeCols = this.options.excludeCols.split(',').map(Number);
        }

        this.init();

        return this;
    }

    // > Prototypes
    TableFilter.prototype = {

        // >> Init
        init: function() {
            // >>> Define variables
            var t = this;
            var opt = this.options;
            var $table = $(this.table);
            var $search = $('<tr>' +
                                '<td colspan="'+$('tbody tr:first td', $table).length+'">' +
                                    '<input type="'+opt.type+'">' +
                                '</td>' +
                            '<tr>');

            // >>> Check length
            if ($('tbody tr', $table).length < parseInt(opt.min)) {
                return this;
            }

            // >>> Construct search
            $('tbody', $table).prepend($search);

            if (typeof opt.class === 'string' && opt.class !== '') {
                $('input', $search).addClass(opt.class);
            }

            if (typeof opt.style === 'string' && opt.style !== '') {
                $('input', $search).attr('style', opt.style);
            }

            if (typeof opt.placeholder === 'string' && opt.placeholder !== '') {
                $('input', $search).attr('placeholder', opt.placeholder);
            }

            // >>> Handler
            $('input', $search).on('keyup', function() {
                t.filterRows($(this).val());
            });

            return this;
        },

        // >> Filter
        filterRows: function(value) {
            var $table = $(this.table);
            var inCols = this.options.inCols;
            var excludeCols = this.options.excludeCols;

            if (!value.length) {
                $('tbody tr', $table).show();
                return this;
            }

            $('tr:not(:first-child)', $table).each(function(i, tr) {
                var hide = true;

                $(tr).find('td').each(function(ii, td) {
                    if (inCols.length && $.inArray((ii + 1), inCols) === -1) {
                        return;
                    }
                    if (excludeCols.length && $.inArray((ii + 1), excludeCols) !== -1) {
                        return;
                    }
                    if (~$(td).text().toLowerCase().indexOf(value.toLowerCase())) {
                        hide = false;
                    }
                });

                if (hide !== true) {
                    $(tr).show();
                } else {
                    $(tr).hide();
                }
            });

            return this;
        }
    }

    // > Register plugin
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            this.each(function() {
                if (!$.data(this, '_' + pluginName)) {
                    $.data(this, '_' + pluginName, new TableFilter(this, options));
                }
            })
            .promise()
            .done();
            return this;
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;

            this.each(function() {
                var instance = $.data(this, '_' + pluginName);
                if (instance instanceof TableFilter && typeof instance[options] === 'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                }
            });

            return returns !== undefined ? returns : this;
        }

        return this;
    }
}));