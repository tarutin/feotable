$(function()
{
    $(document).ready(function()
    {
        if($('.feotable').length > 0)
        {
            $('.feotable').each(function()
            {
                let func = $(this).data('func');
                
                if(typeof func !== 'undefined' && func !== false) {
                    init(func);
                }
            });
        }
    });
});

function init(func)
{
    if(func === 'uniteconomy-clients')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        table.on('change keyup', '.fn-clients, .fn-clients input, .fn-conversion, .fn-conversion input', function(e)
        {
            let clients = getCellByClass('.fn-clients');
            let conversion = getCellByClass('.fn-conversion');
            let total_clients = parseInt(clients * (conversion / 100));
            
            if(isNaN(total_clients)) total_clients = 0;
            
            $('.fn-total-clients').text(comma(total_clients)).trigger('change');
        });
        
        table.on('change keyup', '.fn-total-clients, .fn-pay-conversion, .fn-pay-conversion input', function(e)
        {
            let total_clients = getCellByClass('.fn-total-clients');
            let pay_conversion = getCellByClass('.fn-pay-conversion');
            let paying_clients = parseInt(total_clients * (pay_conversion / 100));
            
            if(isNaN(paying_clients)) paying_clients = 0;
            
            $('.fn-paying-clients').text(comma(paying_clients));
        });
        
        table.on('change keyup', '.fn-conversion, .fn-conversion input, .fn-pay-conversion, .fn-pay-conversion input', function(e)
        {
            let conversion = getCellByClass('.fn-conversion');
            let pay_conversion = getCellByClass('.fn-pay-conversion');
            let total_conversion = parseFloat((conversion * pay_conversion) / 100);
            
            if(isNaN(total_conversion)) total_conversion = 0;
            if(total_conversion % 1 !== 0) total_conversion = total_conversion.toFixed(2);
            
            $('.fn-total-conversion').text(comma(total_conversion));
        });
    }
    
    if(func === 'uniteconomy-cac')
    {
        let table_adv = $(`.feotable[data-func='uniteconomy-adv']`);
        let table_cac = $(`.feotable[data-func=${func}]`);
    
        table_adv.on('change keyup', '.fn-client-cost, .fn-client-cost input', function(e)
        {
            let clients = getCellByClass('.fn-clients');
            let cost = getCellByClass('.fn-client-cost');
            let totaladv = parseInt(clients * cost);
    
            if(isNaN(totaladv)) totaladv = 0;
    
            $('.fn-total-adv').text(comma(totaladv));
        });
    
        table_cac.on('ready', totalCac);
        $('.fn-salary-total').on('change', totalCac);
    
        function totalCac()
        {
            let clients = getCellByClass('.fn-clients');
            let clients_pay = getCellByClass('.fn-clients-pay');
            let total_adv = getCellByClass('.fn-total-adv');
            let total_salary = getCellByClass('.fn-salary-total');
            let total_other = getCellByClass('.fn-total-other');
            let total_costs = getCellByClass('.fn-total-costs');
            let total_clients = $('.fn-1-potential-client').data('total-clients');
            let total_leads = $('.fn-1-lead').data('total-leads');
            let total_paying_clients = $('.fn-1-paying-client').data('total-paying-clients');
            let total = total_adv + total_salary + total_other;
            let total_oneclient = parseInt(total / clients);
            let cac = parseInt(total / clients_pay);
            let potential_client = parseFloat(total / total_clients);
            let lead = parseFloat(total / total_leads);
            let paying_clients = parseFloat(total / total_paying_clients);
    
            if(isNaN(total)) total = 0;
            if(isNaN(total_oneclient)) total_oneclient = 0;
            if(isNaN(cac)) cac = 0;
            if(isNaN(potential_client)) potential_client = 0;
            if(potential_client % 1 !== 0) potential_client = potential_client.toFixed(1);
            if(isNaN(lead)) lead = 0;
            if(lead % 1 !== 0) lead = lead.toFixed(1);
            if(isNaN(paying_clients)) paying_clients = 0;
            if(paying_clients % 1 !== 0) paying_clients = paying_clients.toFixed(1);
    
            $('.fn-total-costs').text(comma(total));
            $('.fn-total-oneclient').text(comma(total_oneclient));
            $('.fn-total-cac').text(comma(cac));
            $('.fn-1-potential-client').text(comma(potential_client));
            $('.fn-1-lead').text(comma(lead));
            $('.fn-1-paying-client').text(comma(paying_clients));
        }
    }
    
    if(func === 'uniteconomy-expense')
    {
        let table = $(`.feotable[data-func=${func}]`);
    
        table.on('change keyup', '.fn-cogs, .fn-cogs input, .fn-1scogs, .fn-1scogs input', function(e)
        {
            let cogs = getCellByClass('.fn-cogs');
            let unoscogs = getCellByClass('.fn-1scogs');
            let avgcheck = parseCell(table.data('avgcheck'));
            let dealnum = parseCell(table.data('dealnum'));
            let ltv = parseInt((avgcheck - cogs) * dealnum - unoscogs);
    
            if(isNaN(ltv)) ltv = 0;
    
            $('.fn-ltv').text(comma(ltv));
        });
    }
    
    if(func === 'uniteconomy-ltv')
    {
        let table = $(`.feotable[data-func=${func}]`);
    
        table.on('change keyup', '.fn-arppu, .fn-arppu input, .fn-cl, .fn-cl input', function(e)
        {
            let arppu = getCellByClass('.fn-arppu');
            let cl = getCellByClass('.fn-cl');
            let ltv = parseInt(arppu * cl);
    
            if(isNaN(ltv)) ltv = 0;
    
            $('.fn-ltv').text(comma(ltv));
        });
        
        table.on('change keyup', '.fn-cl, .fn-cl input', function(e)
        {
            let cl = getCellByClass('.fn-cl');
            let churn = Math.round((1 / cl) * 100);
    
            if(isNaN(churn)) churn = 0;
    
            $('.fn-churn').text(comma(churn));
        });
    }
    
    // if(func === 'discount-rate')
    // {
    //     let table = $(`.feotable[data-func=${func}]`);
    // 
    //     table.on('change keyup', '.fn-capitalisation-rate, .fn-capitalisation-rate input', function(e)
    //     {
    //         let rate = getCellByClass('.fn-capitalisation-rate');
    //         let multiplicator = 1 / (rate / 100);
    // 
    //         if(isNaN(multiplicator)) multiplicator = 0;
    //         if(multiplicator % 1 !== 0) multiplicator = multiplicator.toFixed(2);
    // 
    //         $('.fn-multiplicator').text(multiplicator);
    //     });
    // }
    
    if(func === 'fot-salary')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        table.on('change keyup', '.fn-year, .fn-year input, .fn-number-workers, .fn-number-workers input', function(e)
        {
            table.find('tr').each(function(i)
            {
                let tr = $(this);
                let month = getCell(tr, '.fn-year') / 12;
                let workers = getCell(tr, '.fn-number-workers');

                if(isNaN(month)) month = 0;
                if(month % 1 !== 0) month = month.toFixed(2);
                
                tr.find('.fn-month').text(comma(month));
                tr.find('.fn-total-month').text(comma(month * workers));
            });
        });
    }
    
    if(func === 'production-fact-volumes')
    {
        var tables = $(`.feotable[data-func=${func}]`);
        var warehouse = $(`.feotable[data-func='production-fact-warehouse']`);
        
        $(tables).on('change keyup', '.input, .input input', function(e)
        {
            tables.eq(0).find('tbody tr').each(function(tri)
            {
                $(this).find('td').each(function(tdi)
                {
                    if($(this).hasClass('input')) {
                        
                        let val = getSum(tables.eq(0), tri, tdi)
                                - getSum(tables.eq(1), tri, tdi)
                                - getSum(tables.eq(2), tri, tdi);
                                
                        warehouse.find(`tbody tr:eq(${tri}) td:eq(${tdi})`).text(val);
                    }
                });
            });
        });
        
        function getSum(table, row, col)
        {
            let sum = 0;
            
            table.find(`tbody tr:eq(${row}) td`).each(function(i) {
                if(i <= col && $(this).hasClass('input')) {
                    let val = $(this).hasClass('focus') ? $(this).find('input').val() : $(this).text();
                    sum += parseFloat(val);
                }
            });
            
            return sum;
        }
    }
    
    if(func === 'production-cost-price')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        table.on('change keyup', '.fn-cost, .fn-cost input, .fn-price, .fn-price input', function(e)
        {
            table.find('tr').each(function(i)
            {
                let tr = $(this);
                
                let charge = getCell(tr, '.fn-price') - getCell(tr, '.fn-cost');
                let charge_percent = parseInt((charge / getCell(tr, '.fn-cost')) * 100);
                let margin = parseInt((charge / getCell(tr, '.fn-price')) * 100);
                
                if(isNaN(charge)) charge = 0;
                if(isNaN(charge_percent)) charge_percent = 0;
                if(isNaN(margin)) margin = 0;
                if(charge % 1 !== 0) charge = charge.toFixed(1);
                
                tr.find('.fn-charge').text(comma(charge));
                tr.find('.fn-charge-percent').text(comma(charge_percent));
                tr.find('.fn-margin').text(comma(margin));
            });
        });
    }
    
    if(func == 'production-financing-share')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        $('.feotable').on('change keyup', '.fn-bank, .fn-bank input', function()
        {
            let tr = $(this).closest('tr');
            let capital = parseInt(100 - getCell(tr, '.fn-bank'));
            if(isNaN(capital)) capital = 100;
            
            tr.find('.fn-capital').text(capital);
        });
        
        $('.feotable').on('keyup', '.fn-repayment-bank, .fn-repayment-capital', function()
        {
            let tr = $(this).closest('tr');
            let capital = getCell(tr, '.fn-repayment-capital');
            let bank = getCell(tr, '.fn-repayment-bank');
            
            if(capital <= bank) {
                // $('.fn-repayment-capital, .fn-repayment-bank').removeClass('focus').addClass('wrong').text('').find('input').val('');
                $('.fn-repayment-capital').addClass('wrong');
                $('.fn-repayment-bank').addClass('wrong');
                // $('.fn-repayment-capital input, .fn-repayment-bank input').trigger('blur');
                warning(__('feotable.repayment_bank_warning'));
            }
            else if(parseInt(bank) == 0) {
                // $('.fn-repayment-bank').addClass('wrong').removeClass('focus').text(1);
                warning(__('feotable.repayment_bank_zero_warning'));
            }
            else {
                $('.fn-repayment-capital, .fn-repayment-bank').removeClass('wrong');
            }
        });
    }
    
    if(func == 'development-financing')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        $('.feotable').on('change keyup', '.fn-bank, .fn-bank input', function()
        {
            let tr = $(this).closest('tr');
            let capital = parseInt(100 - getCell(tr, '.fn-bank'));
            if(isNaN(capital)) capital = 100;
            
            tr.find('.fn-capital').text(capital);
        });
        

        $('.feotable').on('change', '.fn-repayment-bank, .fn-repayment-equity', function()
        {
            let tr = $(this).closest('tr');
            let equity = tr.find('.fn-repayment-equity').attr('data-key');
            let bank = tr.find('.fn-repayment-bank').attr('data-key');
            
            if(equity == 1 || bank == 1) $('.fn-repayment-dscr').removeAttr('hidden');
            else $('.fn-repayment-dscr').attr('hidden', 'hidden');
            
            if(equity == 2 || bank == 2) $('.fn-repayment-annuity').removeAttr('hidden');
            else $('.fn-repayment-annuity').attr('hidden', 'hidden');
            
            if(equity == 3 || bank == 3) $('.fn-repayment-diff').removeAttr('hidden');
            else $('.fn-repayment-diff').attr('hidden', 'hidden');
            
            if(equity == 4 || bank == 4) $('.fn-repayment-manual').removeAttr('hidden');
            else $('.fn-repayment-manual').attr('hidden', 'hidden');
        });

    }
    
    if(func == 'development-taxes')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        table.on('change', '.fn-taxation', function()
        {
            let tr = $(this).closest('tr');
            let taxation = tr.find('.fn-taxation').attr('data-key');
            
            if(taxation == 1) $('.fn-taxation-rate').text(20);
            if(taxation == 2) $('.fn-taxation-rate').text(6);
            if(taxation == 3) $('.fn-taxation-rate').text(15);
        });
    }
    
    if(func == 'production-capital-expenses')
    {
        let table = $(`.feotable[data-func=${func}]`);
        
        table.on('row_add', 'tr', function()
        {
            $(this).find('.num').text(0);
        });
    }
}

const getCell = function(tr, td) {
    let result;
    
    if(tr.find(td).hasClass('focus')) result = tr.find(td).find('input').val();
    else result = tr.find(td).text();
    
    return parseCell(result);
};

const getCellByClass = function(cl) {
    let result;
    
    if($(cl).hasClass('focus')) result = $(cl).find('input').val();
    else result = $(cl).text();
    
    return parseCell(result);
};

const parseCell = function(val) {
    val = val.toString().replace(/ /g, '').replace(/,/g, '');
    return parseFloat(val);
};

window._validate = function(_table, _options = {})
{
    var _errors = false;
    var _first_error = null;
    var _if_error = function(self) {
        self.addClass('wrong');
        _errors = true;
        if(!_first_error) {
            _first_error = {
                top: self.offset().top - 200,
                left: self.offset().left - ($(window).width() / 2)
            };
        }
    };
    
    if(_table.hasClass('feotable-disabled')) return;

    _table.find('.wrong').removeClass('wrong');

    if(_options.onSave == true) {
        _table.find('tr:not(.add-tpl):not([hidden]) td.required').each(function() {
            let _val = $(this).hasClass('focus') ? $(this).find('input').val() : $(this).text();
            if(_val !== undefined && trim(_val) === '') _if_error($(this));
        });
    }

    _table.find('tr:not(.add-tpl):not([hidden]) td.nonzero').each(function() {
        let _is_filled = trim($(this).text()) !== '';
        let _num = $(this).text().replace(/ /g, '').replace(/,/g, '').replace('/', '');
        if(_is_filled && parseFloat(_num) == 0) _if_error($(this));
    });

    _table.find('tr:not(.add-tpl):not([hidden]) td.num').each(function() {
        let _is_filled = trim($(this).text()) !== '';
        let _num = $(this).text().replace(/ /g, '').replace(/,/g, '').replace('/', '');
        let _is_num = $.isNumeric(_num);
        if(_is_filled && !_is_num) _if_error($(this));
        if(!$(this).hasClass('negnum') && _is_filled && parseFloat(_num) < 0) _if_error($(this));
        if(!$(this).hasClass('negnum') && _is_filled && parseFloat(_num) > 10000000000) _if_error($(this));
        if($(this).hasClass('negnum') && _is_filled && parseFloat(_num) < -10000000000) _if_error($(this));
    });

    _table.find('tr:not(.add-tpl):not([hidden]) td.percent').each(function() {
        let _is_filled = trim($(this).text()) !== '';
        let _num = $(this).text().replace(/ /g, '').replace(/,/g, '').replace('/', '');
        let _is_num = $.isNumeric(_num);
        if(_is_filled && !_is_num) _if_error($(this));
        if(_is_filled && parseFloat(_num) < 0) _if_error($(this));
        if(!$(this).hasClass('gt100') && _is_filled && parseFloat(_num) > 100) _if_error($(this));
    });

    _table.find('tr:not(.add-tpl):not([hidden]) td.date').each(function() {
        let _is_filled = trim($(this).text()) !== '';
        let _is_date = moment($(this).text(), 'DD.MM.YYYY', true).isValid();
        if(_is_filled && !_is_date) _if_error($(this));
    });

    if(_errors && _options.onSave == true) {
        window.scrollTo({
            top: _first_error.top,
            left: _first_error.left,
            behavior: 'smooth'
        });
    }

    return _errors;
};

window.trim = function(_str)
{
    return _str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

window.comma = function(_value)
{
    let separator = ',';
    let parts = _value.toString().split('.');
    
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    
    return parts.join('.');
};
