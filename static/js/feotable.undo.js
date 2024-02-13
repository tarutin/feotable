function feolog_init()
{
    // https://stackoverflow.com/questions/15516218/how-to-handle-undo-redo-event-in-javascript
    // https://stackoverflow.com/questions/30337278/handsonetable-undo-redo-over-multiple-instances-of-component
    // https://coderoad.ru/42882266/Как-я-могу-сделать-undo-redo-в-textarea-чтобы-реагировать-на-1-слово-за-раз
    
    var _feolog = {
        list: [],
        step: 0,
    };
    
    $('.feotable').each(function(i) {
        
        $(this).find('tbody td').each(function(j) {
            
            var _x = $(this).closest('td').index(),
                _y = $(this).closest('tr').index(),
                _val = $(this).text();
            
            _feolog['list'].push({s: 'i', t: i, y: _y, x: _x, v: _val});
            // console.log( 'log_current', i, _y, _x, _val );
        });
    });
    
    $('.feotable tbody').on('change', 'td, td input', function(e) {
        
        let _ft = $(this).closest('.feotable').data('feotable'),
            _x = $(this).closest('td').index(),
            _y = $(this).closest('tr').index(),
            _val = $(this).val() || $(this).text();
            
        if(!_val) return;
        
        _feolog['step']++;
        _feolog['list'].push({s: 'log', t: _ft, y: _y, x: _x, v: _val});
        // console.log( 'log', _val, _ft, _y, _x );
    });
    
    $(document).on('keydown', function(e)
    {    
        e = e || window.event;
        let key = e.which || e.keyCode;
        let ctrl = e.ctrlKey ? e.ctrlKey : key === 17;
        let cmd = e.metaKey;
        // console.log(key);
        
        // undo
        if((ctrl || cmd) && key == 90) {
            _feolog['step']--;
            // console.log(_feolog);
        }
        
    });
}


$(function()
{
    $(document).ready(function()
    {
        if($('.enter .feotable').length > 0) feolog_init();
    });
});
