/*
    Title: Nei-Panel
    Author: Neimark Junsay Braga
    Date: 9/25/17
    Version: 1.0.0
*/
$.fn.neipanel = function(a) {
    var element = this;
    var NeiPanel = function (option) {
        var neiPanel = this;
        this.option = option;
        option = option || {};
        option.panelClass = option.panelClass || '';
        option.hideBarClass = option.hideBarClass || '';
        option.hideIconClass = option.hideIconClass || '';
        option.hideDuration = option.hideDuration || 400;
        option.showDuration = option.showDuration || 400;
        option.position = (['top','right','bottom','left'].indexOf(option.position) > -1)? option.position:'left';
        option.panelSize = option.panelSize || '300px';
        option.hideBarSize = option.hideBarSize || '20px';
        option.zIndex = option.zIndex || 3;
        option.backdropOpacity = option.backdropOpacity || '.5';
        var temp = undefined;
        var pos = {
            top: option.position == 'top',
            right: option.position == 'right',
            bottom: option.position == 'bottom',
            left: option.position == 'left'
        };
        var elements = {
            backdrop: document.createElement('div'),
            buttonBar: document.createElement('div'),
            hideIcon: document.createElement('span'),
            panel: document.createElement('div')
        };
        var expand = (pos.bottom || pos.top)? 'height':'width';
        var oppsitePosition = function (position) {
            switch (position){
                case 'top': return 'bottom'; break;
                case 'bottom': return 'top';
                case 'left': return 'right';
                case 'right': return 'left'; break;
                default: return null; break;
            }
        };
        var hideIcon = function () {
            switch (option.position){
                case 'top': return '&#9206;'; break;
                case 'right': return '&#9205;'; break;
                case 'bottom': return '&#9207;'; break;
                case 'left': return '&#9204;'; break;
            }
        };
        $(elements.panel)
            .attr('class', option.panelClass)
            .css('background-color', 'white')
            .css('overflow', 'auto')
            .css('position', 'fixed')
            .css('z-index', String(parseInt(option.zIndex)+1))
            .css('height', (pos.bottom || pos.top)? option.panelSize:'100%')
            .css('width', (pos.right || pos.left)? option.panelSize:'100%')
            .append(element);
        for(temp in pos) if(temp != oppsitePosition(option.position)) $(elements.panel).css(temp, '0');
        $(elements.panel).css(option.position, '-105%');

        $(elements.hideIcon)
            .attr('class', option.hideIconClass)
            .css('font-size', option.hideBarSize)
            .html(hideIcon());

        $(elements.buttonBar)
            .attr('class', option.hideBarClass)
            .css('background-color', 'rgba(255,255,255,.5)')
            .css('justify-content','center')
            .css('align-items','center')
            .css('overflow', 'hidden')
            .css('cursor','pointer')
            .css('position','fixed')
            .css('display','flex')
            .css('height',(pos.bottom || pos.top)? '0':'100%')
            .css('width', (pos.right || pos.left)? '0':'100%')
            .css('z-index', String(parseInt(option.zIndex)+1))
            .append(elements.hideIcon)
            .on('click', function () {neiPanel.hide();});
        for(temp in pos) if(temp != oppsitePosition(option.position)) $(elements.buttonBar).css(temp, '0');

        $(elements.backdrop)
            .css('background-color', 'black')
            .css('position', 'fixed')
            .css('height', '100%')
            .css('width', '100%')
            .css('opacity', '0')
            .css('z-index', option.zIndex)
            .css('top', '0')
            .css('right', '0')
            .css('bottom', '0')
            .css('left', '0');

        $('body')
            .append(elements.panel)
            .append(elements.buttonBar)
            .append(elements.backdrop);

        this.show = function () {
            $(element).trigger({type: "neipanel.show"});
            $('body').css('overflow', 'hidden');
            var panelAnimation = {};
            panelAnimation[option.position] = '0';
            $(elements.panel).animate(panelAnimation, option.showDuration, 'swing', function () {
                $(element).trigger({type: "neipanel.shown"});
            });

            var barAnimation = {};
            barAnimation[expand] = option.hideBarSize;
            barAnimation[option.position] = option.panelSize;
            $(elements.buttonBar).animate(barAnimation, option.showDuration);

            $(elements.backdrop).animate({
                opacity: option.backdropOpacity
            }, option.showDuration);



        };
        this.hide = function () {
            $(element).trigger({type: "neipanel.hide"});
            $('body').css('overflow', '');
            var panelAnimation = {};
            panelAnimation[option.position] = '-105%';
            $(elements.panel).animate(panelAnimation, option.hideDuration, 'swing', function () {
                $(element).trigger({type: "neipanel.hidden"});
            });

            var barAnimation = {};
            barAnimation[expand] = '0';
            barAnimation[option.position] = '0';
            $(elements.buttonBar).animate(barAnimation, option.hideDuration);

            $(elements.backdrop).animate({
                opacity: '0'
            }, option.hideDuration);
        };
    };
    if(a.constructor != String) $(element).data('neipanel', new NeiPanel(a));
    else if($(element).data('neipanel')) $(element).data('neipanel')[a]();
};