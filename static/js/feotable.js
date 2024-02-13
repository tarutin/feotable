$(function()
{
    $(document).ready(function()
    {
        if($('.enter .feotable').length > 0) feotable_init();
        if($('.output .feotable').length > 0) _feotable_summary();
        if($('.output .feotable').length > 0) _feotable_openlevel();
        if($('.enter .feotable').length > 0) _feotable_onchangenotify();
        // if($('div[section=mainParamsDTO]').length > 0) _feotable_onchangenotify();
        if($('.feotable').length > 0) feotable_sticky();
    });
});

window._feotable_openlevel = function()
{
    $('.feotable').on('click', '.open-level td.sticky', function() {
        let tr = $(this).closest('tr');
        tr.toggleClass('opened');
        tr.nextUntil('.spacer, .level-0, .level-1', '.level-2').attr('hidden', function(_, attr) { return !attr });
    });
};

window._feotable_expandall = function(){
    $(".sticky").each(function(){$(this).click();});
};

function _feotable_onchangenotify()
{
    var _confirmed = false;

    $('.project').data('changed', 'false');

    $('.feotable tbody').on('change', 'td, td input', function() {
        $('.project').data('changed', 'true');
    });

    $('.project').on('change', 'input, select', function() {
        $('.project').data('changed', 'true');
    });

    $('a').on('click', function()
    {
        if(
            $(this).hasClass('nav1-toggle') ||
            $(this).hasClass('nav0-toggle') ||
            $(this).hasClass('profile-show')
        ) return;

        if($('.project').data('changed') == 'true') {
            _confirmed = confirm('Confirm');
            return _confirmed;
        }
    });

    $(window).bind('beforeunload', function() {
        if($('.project').data('changed') == 'true' && !_confirmed) {
            return false;
        }
    });
}

function _recalc_format(_feotable)
{
    _feotable.find('.num, .percent').each(function(i)
    {
        if(!$(this).hasClass('focus'))
        {
            let _td = $(this);
            let _value = _td.text();

            if(trim(_value) === '') _value = 0;

            _td.text(comma(_value));
        }
    });
}

function recalc(_feotable, _options = {})
{
    _recalc_horizontal_multiply(_feotable);
    _recalc_horizontal_all_num(_feotable);
    _recalc_vertical_total(_feotable);
    _recalc_assign(_feotable);
    _recalc_assign_sum(_feotable);
    if(!_options.noformat) _recalc_format(_feotable);
}

function feotable_sticky()
{
    var _stucked = false;
    var _sticky_on = 30;

    $(document).on('scroll', function()
    {
        let _x = $(this).scrollLeft();

        if(_x > _sticky_on && _stucked == false) {
            _stucked = true;
            $(this).find('.feotable .sticky').addClass('stuck');
        }

        if(_x <= _sticky_on && _stucked == true) {
            _stucked = false;
            $(this).find('.feotable .sticky').removeClass('stuck');
        }
    });
}

function _feotable_addtpl()
{
    $('.feotable').each(function() {
        let _is_input = $(this).find('tr td.input:first-child').length;
        if(!_is_input) return;

        let _tbody = $(this).find('tbody');
        let _tr = _tbody.find('tr:last-child');
        let _tpl = _tr.clone();
        let _spacer = $(`<td class='add-tpl-spacer noedit' colspan='${_tr.find('td').length-1}'></td>`);

        _tpl.addClass('add-tpl');
        _tpl.find('.feotabletools').remove();
        _tpl.find('td:not(.noremove)').html('');
        if(!_tpl.is('[keep-section-row]')) _tpl.attr('section-row', '');
        _tpl.removeAttr('hidden');
        _tpl.find('td:nth-child(n+2)').attr('hidden', 'hidden');
        _tpl.find('td:first-child').html(`<span class='grey'>+ Add</span>`).after(_spacer);

        _tbody.append(_tpl);

        $(this).trigger('table_addrow');
        _tpl.trigger('row_add');
    });

    $('.feotable').on('click', '.add-tpl td:first-child', function() {
        let _tbody = $(this).parents('tbody');
        let _tr = $(this).parents('tr');
        _tbody.find('tr[hidden]').remove();
        _tr.find('.add-tpl-spacer').remove();
        _tr.find('td[hidden]').removeAttr('hidden');
        _tr.removeClass('add-tpl');
        let _rows_count = $(this).parents('.feotable').find('tbody tr:not(.add-tpl)').length-1;
        _tr.attr('section-row', _rows_count);
        $(this).text('');
    });
}

function _feotable_sortable()
{
    $('.feotable tbody').sortable(
    {
        handle: '.sort',
        placeholder: 'ui-state-highlight',
        axis: 'y',
        update: function(e, ui) {
            $('.feotabletools').remove();
            recalc(ui.item.parents('table'));
        }
    });
}

function _feotable_tools()
{
    // <span class='icon icon-sm vbars-blue no-hover sort'></span>
    var _tools = $(`<div class='feotabletools user-select-none'>
        <span class='icon icon-sm add-square-blue no-hover add me-2'></span>
        <span class='icon icon-sm trash-blue no-hover remove'></span>
    </div>`);

    $('.feotable').on('mouseenter mouseleave', 'tr:not(.add-tpl) td.sticky:not(.noedit)', function(e)
    {
        _tools.css($(this).position()).appendTo($(this).parents('tr'));
    });
    $('.feotable').on('mouseenter', 'td:not(.sticky), th', function(e)
    {
         $('.feotabletools').remove();
    });

    $('.feotable').on('click', '.feotabletools .remove', function()
    {
        let _rows_count = $(this).parents('.feotable').find('tbody tr:not(.add-tpl)').length;

        if(_rows_count > 1) {
            let sr = $(this).parents('tr').attr('section-row');
            if (sr.length !== 0) {
                $(this).parents('tr').parent().append('<tr section-row="' + sr + '" style="display: none"><td section-row-value="DELETED">' + sr + '</td></tr>');
                $(this).parents('tr').remove();

                $('.feotable').each(function () {
                    recalc($(this));
                });
            }
        }
        else {
            warning('Last row');
        }
    });

    $('.feotable').on('click', '.feotabletools .add', function(e)
    {
        var rand = function() {
            return Math.random().toString(36).substr(2);
        };

        let _table = $(this).parents('table');
        let _tr = $(this).parents('tr');
        let _tpl = _tr.clone();
        _table.find('.add-tpl').remove();
        _tpl.find('.feotabletools').remove();
        _tpl.find('.wrong').removeClass('wrong');
        _tpl.find('.focus').removeClass('focus');
        _tpl.find('td:not(.noremove)').html('');
        _tpl.find('td.add-random-key').attr('data-key', rand() + rand());
        let _rows_count = $(this).parents('.feotable').find('tbody tr:not(.add-tpl)').length;
        if(!_tpl.is('[keep-section-row]')) _tpl.attr('section-row', _rows_count);

        $(this).parents('tbody').append(_tpl);
        _table.find('tbody tr:last-child td:first-child').click();
        recalc(_table);

        _table.trigger('table_addrow');
        _tpl.trigger('row_add');
    });
}

function _feotable_cell_input()
{
    var _tcs = [];
    var _tcs_buffer = new TableCellSelector.Buffer();
    var _tcs_options = {
        tableClass:'feoselection',
        selectClass:'preselect',
        changeTracking:true,
        deselectOutTableClick:false,
        enableHotkeys:true,
        enableChanging:true,
        ignoreTfoot:true,
        ignoreThead:true,
        ignoreClass:'noedit',
        ignoreClass2:'select',
        selectIgnoreClass: true,
        onFinishSelect: function(e) {

            $('.feotable').each(function() {
                recalc($(this));
                _validate($(this));
            });

            $('.feotable td.focus input').trigger('blur');
        },
        setCellFn: function (cell, data, coord) {

            if(data !== undefined && trim(data) == '-') data = 0;

            if(cell.classList.contains('num')) data = accounting.unformat(data);
            if(cell.classList.contains('percent')) data = accounting.unformat(data);

            cell.innerText = data;
        },
    };
    var _tcs_init = function()
    {
        document.querySelectorAll('.feotable').forEach(function(_table) {
            _tcs.push(new TableCellSelector(_table, _tcs_options, _tcs_buffer));
        });
    };
    var _input_activate = function(e, that, options = {})
    {
        let _td = that;
        let _ft = _td.closest('.feotable').data('feotable');
        let _tcs_pos = _tcs[_ft].getCoords();
        let _prevText = _td.text();
        let _input = $(`<input type='text'/>`);

        _tcs[_ft].destroy();
        _tcs = [];

        if(_td.hasClass('num')) _prevText = _prevText.replace(/ /g, '').replace(/,/g, '');
        if((_td.hasClass('num') || _td.hasClass('percent')) && _prevText == 0) _prevText = '';
        _td.text('').addClass('focus');
        _input.height(_td.height()).val(trim(_prevText)).appendTo(_td).trigger('focus');
        if(options.clear == true) _input.val('');

        _input.on('keyup blur', function(e)
        {
            if(e.which == 13 || e.type == 'blur') {
                _td.text($(this).val()).removeClass('focus');
            }

            if(e.which == 27) {
                _td.text(_prevText).removeClass('focus');
            }

            if(e.which == 27 || e.which == 13 || e.type == 'blur') {
                _tcs_init();
                if(e.which == 13) {
                    setTimeout(function() {
                        _tcs[_ft].select(_tcs_pos[0], _tcs_pos[1]);
                    }, 1);
                }
            }

            $('.feotable').each(function() {
                recalc($(this));
                _validate($(this));
            });
        });

        _input.on('click', function() {
            return false;
        });
    };

    $('body').on('mouseup', function(e)
    {
        let preselect = $('.feotable .preselect:first');
        if(preselect.length === 0) return;

        if(!(e.target.nodeName == 'TD')) {
            $('.feotable').each(function() {
                let _ft = $(this).data('feotable');
                _tcs[_ft].deselect();
            });
        }
    });

    $(document).on('keydown keyup', function(e)
    {
        let preselect = $('.feotable .preselect:first');
        let _ft = preselect.closest('.feotable').data('feotable');
        if(e.type == 'keydown' && preselect.length === 0) return;

        e = e || window.event;
        let key = e.which || e.keyCode;
        let ctrl = e.ctrlKey ? e.ctrlKey : key === 17;
        let cmd = e.metaKey;

        // enter
        if(e.type == 'keyup' && key == 13) {
            preselect.trigger('dblclick');
        }

        // copy
        if(e.type == 'keydown' && (ctrl || cmd) && key == 67) {
            info('Copied');
        }

        // letters & numbers
        if(e.type == 'keydown' && !ctrl && !cmd && key <= 90 && key >= 48) {
            preselect.trigger('clickclear');
        }

        // delete
        if(e.type == 'keyup' && (key == 46 || key == 8)) {
            $('.feotable').each(function() {
                recalc($(this));
                _validate($(this));
            });

            setTimeout(function() {
                preselect.trigger('change');
            }, 1);
        }

        // paste
            // before
            if(e.type == 'keydown' && (ctrl || cmd) && key == 86) {
                setTimeout(function() {
                    preselect.trigger('change');
                }, 10);
            }

            // after
            if(e.type == 'keyup' && key == 86) {

                setTimeout(function() {
                    preselect.trigger('change');
                }, 10);

                $('.feotable').each(function() {
                    recalc($(this));
                    _validate($(this));
                });
            }

        // move
        if(e.type == 'keydown' && [37, 38, 39, 40, 9].indexOf(key) > -1) {

            e.preventDefault();

            $('.feotable').each(function() {
                recalc($(this));
                _validate($(this));
            });

            let pos = _tcs[_ft].getCoords();

            if(key == 39 || key == 9) _tcs[_ft].select([pos[0][0], pos[0][1]+1], [pos[1][0], pos[1][1]+1]); // right
            if(key == 37) _tcs[_ft].select([pos[0][0], pos[0][1]-1], [pos[1][0], pos[1][1]-1]); // left
            if(key == 38) _tcs[_ft].select([pos[0][0]-1, pos[0][1]], [pos[1][0]-1, pos[1][1]]); // up
            if(key == 40) _tcs[_ft].select([pos[0][0]+1, pos[0][1]], [pos[1][0]+1, pos[1][1]]); // down

            return false;
        }
    });

    $('.feotable').on('dblclick', 'td.input:not(.focus)', function(e) { _input_activate(e, $(this)); });
    $('.feotable').on('clickclear', 'td.input', function(e) { _input_activate(e, $(this), {clear: true}); });

    $(document).ready(_tcs_init);
}

function _feotable_summary()
{
    if($('.app').hasClass('livei18n')) return;

    var _summary = $(`<div class='feotablesummary'>
    <span class='count'>Selected <b></b></span>
        <span class='total'>Total <b></b></span>
        <span class='avg'>Avg <b></b></span>
    </div>`);

    function formatCell(cell, coord)
    {
        let _data_value = cell.getAttribute('data-value');
        let _result = _data_value && _data_value !== ''
            ? _data_value
            : cell.innerText.replace(/(?:\r\n|\r|\n)/g, ' ').replace('—', 0);

        return _result;
    }

    document.querySelectorAll('.feotable').forEach(function(_table) {
        var tcs = new TableCellSelector(
            _table,
            {
                getCellFn: formatCell,
                tableClass:'feoselection',
                selectClass:'selected',
                enableChanging:false,
                onDeselect: function() {
                    _summary.remove();
                },
                onFinishSelect: function(event) {
                    var selected = _table.querySelectorAll('.selected');
                    var total = getTotal(selected) ?? 0;
                    var count = selected.length;
                    var avg = Math.round((total / count) * 100) / 100 ?? 0;

                    if(count >= 2) {
                        _summary.find('.total b').text(comma(total));
                        _summary.find('.count b').text(comma(count));
                        _summary.find('.avg b').text(comma(avg));
                        _summary.appendTo('main .output');
                        _summary.css({'margin-left': (_summary.width() / 2 * -1) + 'px'});
                    }
                }
            },
            new TableCellSelector.Buffer()
        );

        var getTotal = function(selected) {
            var total = 0;

            $.each(selected, function(i, cell) {
                let num = parseFloat(cell.innerText.replace(/ /g, '').replace(/,/g, ''));
                if(!isNaN(num)) total += num;
            });

            return Math.round(total * 100) / 100;
        };
    });
}

function _feotable_cell_select()
{
    $('.feotable').on('mouseover', 'td.select', function(e)
    {
        let _td = $(this);
        let _prevText = _td.text();
        let _options = _td.data('options');
        let _select = $(`<select class='custom-select'></select>`);

        if(!_td.hasClass('focus'))
        {
            _options.split('|').forEach(function(option, i) {
                let _option_value = option.split('=').pop();
                let _option_key = option.split('=').shift();
                let _selected = trim(_prevText) == trim(_option_value) ? 'selected' : '';
                _select.append(`<option value='${_option_key}' ${_selected}>${_option_value}</option>`);
            });

            _td.text('').addClass('focus preselect');
            _select.width(_td.width()).height(_td.height()).appendTo(_td);

            _select.on('change mouseout mouseleave blur', function(e)
            {
                let _option_selected = _select.find(':selected').text();

                _td.text(_option_selected).attr('data-key', $(this).val()).removeClass('focus preselect');
                if(_td.hasClass('wrong')) _td.removeClass('wrong');
                if(e.type == 'change') _td.trigger('change');
            });
        }
    });
}



function feotable_init()
{
    _feotable_addtpl();
    // _feotable_sortable();
    // _feotable_tools();
    _feotable_cell_input();
    _feotable_cell_select();

    $('.feotable').each(function(i) {
        $(this).attr('data-feotable', i);
        recalc($(this));
        $(this).trigger('ready');
    });
}

function _recalc_horizontal_all_num(_feotable)
{
    let _hbody = _feotable.find('tbody td[data-calc-total]');

    _hbody.each(function(i)
    {
        let _td = $(this);
        let _tr = _td.parents('tr');
        let _total = 0;

        _tr.find('td').each(function(j)
        {
            let ignore = $(this).data('calc-total-ignore');
            let self = $(this).data('calc-total');
            let val = $(this).hasClass('focus') ? $(this).find('input').val() : $(this).text();

            val = parseFloat(val.replace(/ /g, '').replace(/,/g, ''));

            if(!$(this).hasClass('num') || val == '') return;
            if(typeof ignore !== 'undefined' && ignore !== false) return;
            if(typeof self !== 'undefined' && self !== false) return;
            if(isNaN(val)) return;

            _total += val
        });

        _td.text(comma(_total));
    });
}

function _recalc_horizontal_minus(_feotable)
{
    let _hbody = _feotable.find('tbody td[data-minus]');

    _hbody.each(function(i)
    {
        let _td = $(this);
        let _index = _td.index();
        let _cols = _td.data('minus');
        let _tr = _td.parents('tr');
        let _multiply = [];
        let _result = 0;

        _cols.split(',').forEach(function(field)
        {
            let _field_index = _feotable.find(`thead th[data-field='${field}']`).index();
            let _td = _tr.find('td').eq(_field_index);
            let _value = null;

            if(_td.hasClass('focus')) _value = _td.find('input').val();
            else _value = _td.text();

            _value = parseFloat(_value.replace(/ /g, '').replace(/,/g, ''));

            if(_value) _multiply.push(_value);
        });

        if(_multiply.length == _cols.split(',').length)
        {
            for (var i = 0; i < _multiply.length; i++) {
                if(i == 0) _result = _multiply[i];
                else _result -= _multiply[i];
            }

            if(_result) _td.text(comma(_result));
        }
        else
        {
            _td.text('');
        }
    });
}

function _recalc_horizontal_multiply(_feotable)
{
    let _hbody = _feotable.find('tbody td[data-multiply]');

    _hbody.each(function(i)
    {
        let _td = $(this);
        let _index = _td.index();
        let _cols = _td.data('multiply');
        let _tr = _td.parents('tr');
        let _multiply = [];
        let _total = 1;

        _cols.split(',').forEach(function(field)
        {
            // console.log(field);
            let _field_index = _feotable.find(`thead th[data-field='${field}']`).index();
            let _td = _tr.find('td').eq(_field_index);
            let _value = null;

            if(_td.hasClass('focus')) _value = _td.find('input').val();
            else _value = _td.text();

            _value = parseFloat(_value.replace(/ /g, '').replace(/,/g, ''));

            if(_value) _multiply.push(_value);
        });

        if(_multiply.length == _cols.split(',').length)
        {
            for (var i = 0; i < _multiply.length; i++) {
                _total = _total * _multiply[i];
            }

            if(_total) _td.text(comma(_total));
        }
        else
        {
            _td.text('');
        }
    });
}

function _recalc_vertical_total(_feotable)
{
    let _vfooter = _feotable.find('tfoot th[data-calc]');
    let _vbody = _feotable.find('tbody tr');

    _vfooter.each(function(i)
    {
        let _th = $(this);
        let _index = _th.index();
        let _th_total = 0;

        if((_th.data('calc') == 'sum') || (_th.data('calc') == 'sumround'))
        {
            _vbody.each(function(j)
            {
                let _td = $(this).find('td').eq(_index);
                let _value = null;

                if(_td.hasClass('focus')) _value = _td.find('input').val();
                else _value = _td.text();

                _value = parseFloat(_value.replace(/ /g, '').replace(/,/g, ''));

                if(_value) _th_total += _value;
            });

            if (_th.data('calc') == 'sumround') {
                if(_th_total) _th.text(comma(Math.round(_th_total)));
                else _th.text('');
            } else {
                if(_th_total) _th.text(comma(_th_total));
                else _th.text('');
            }

            _th.trigger('change');
        }
    });
}

function _recalc_assign(_feotable)
{
    let _abody = _feotable.find('tbody td[data-assign]');
    _abody.each(function(i)
    {
        let _td = $(this);
        let _get = $(_td.data('assign')).text();
        _td.text(_get);
    });
}

function _recalc_assign_sum(_feotable)
{
    let _abody = _feotable.find('tbody td[data-assign_sum]');
    _abody.each(function(i)
    {
        let _td = $(this);
        let _current = 0;

        $($(this).data('assign_sum')).each(function(i)
        {
            let _val = parseFloat($(this).text().replace(/ /g, '').replace(/,/g, ''));

            _current += _val;
            _td.text(_current);
        });
    });
}
