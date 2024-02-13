$(document).ready(function()
{
    $('.feotable-save').on('submit', function ()
    {
        var errors = false;
        var button = $("button", this);
        var btn_prev = button;
        var btn_prev_text = button.html();
        
        $('.feotable').each(function() {
            if(_validate($(this), {'onSave': true})) {
                errors = true;
                warning(__('feotable.save_validation_warning'));
            }
        });
        
        if(!errors)
        {
            var data = compileData($(this), button);
            
            button
                .width(btn_prev.width())
                .height(btn_prev.height())
                .html(`<span class='icon icon-sm spinner-white spin'></span>`)
                .attr("disabled", "disabled")
            ;
            
            $.ajaxSetup({
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
            });
            
            $.ajax($(this).attr('action'), {
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                fail: function (resp) {
                    warning(__('feotable.save_error'));
                    button.removeAttr("disabled").html(btn_prev_text);
                },
                success:function (resp) {
                    notice(__('feotable.save_success'));
                    button.removeAttr("disabled").html(btn_prev_text);
                    $('.project').data('changed', 'false');
                    
                    if(!getcookie('model_saved'))
                    {
                        // if(location.hostname == 'app.feo.finance')
                        // {
                        //     carrotquest.onReady(function() {
                        //         carrotquest.track('model_saved');
                        //     });
                        //     ym(84277027, 'reachGoal', 'MODEL_SAVED');
                        // }
                        
                        setcookie('model_saved', true, (3600*24*365));
                    }
                }
            });
        }
        
        return false;
    });
});

function compileData(that, button)
{
    var arr = {};
    var temp, temp2, key, key2;
    var button = $("button",that);
    var text = '';

    var iCount = 0;
    
    $('[section]').each(function() {
        var c = $(this).attr('section').split(',');
        if (c.length === 2){
            if (typeof arr[c[0]] === "undefined") {
                arr[c[0]] = {};
            }
            if (typeof arr[c[0]][c[1]] === "undefined") {
                arr[c[0]][c[1]] = {};
            }
            temp = arr[c[0]][c[1]];
        } else {
            if (typeof arr[$(this).attr('section')] === "undefined") {
                arr[$(this).attr('section')] = {};
            }
            temp = arr[$(this).attr('section')];
        }
        
        $('[section-row]', this).each(function () {
            
            if($(this).hasClass('add-tpl')) return;
            
            key = $(this).attr('section-row');

            //if ($(this).attr('section-row') !== "undefined")
            {
                if (!key.length) {
                    $(this).attr('section-row', iCount);
                    key = iCount;
                }
            }

            if (typeof temp[$(this).attr('section-row')] === "undefined") {
                if (key.length == 0 || c[0] ==key){

                } else {
                    temp[$(this).attr('section-row')] = {};
                }
            }
            var key1 = $(this).attr('section-row');
            if (key.length == 0 || c[0] ==key){
                temp2 = temp;
            } else {
                temp2 = temp[key1];
            }
            
            $('[section-row-value]', this).each(function () {
                var key = $(this).attr('section-row-value');
                //console.log( key , key1 );
                if ( $(this).attr('section-row-value').length && $(this).text().length && (key !== key1) || $(this).hasClass('isnull') ) {
                    var keys = key.split(',');
                    var tt = 'temp2';
                    for(var i in keys) {
                        tt = tt + '["' + keys[i] + '"]';
                        eval("if (typeof " + tt + " === 'undefined') {" + tt + "={};}");
                    }
                    text = selectSectionControl(this);
                    if (typeof text === "undefined"){
                        return;
                    }
                    eval(tt+" = text;");
                } else if (key === key1) {
                    text = selectSectionControl(this);
                    if (typeof text === "undefined"){
                        return;
                    }

                    temp[key1] = text;
                }
             });
            iCount++;
        });
    });
    
    return arr;
}

function selectSectionControl(that)
{
    var text = '';
    switch ($(that).prop('tagName')){
        case 'INPUT':
            if ($(that).attr('type') === 'radio' && !$(that).is(':checked')) {
                return undefined;
            }
            text = $(that).val();
            break;
        case 'SELECT':
            text = $(':selected',that).val();
            break;
        default:
            if (typeof $(that).data('key') !== "undefined") {
                text = $(that).attr('data-key');
            } else {
                if ($(that).hasClass('num')) {
                    text = $(that).text().replace(/ /g, '');
                } else {
                    text = $(that).text();
                }
            }
    }
    text = text.replaceAll(',','');
    if ($(that).attr('type')==='number') {
        text = parseInt(text);
    }
    if ($(that).attr('type')==='float') {
        text = parseFloat(text);
    }
    return text;
}