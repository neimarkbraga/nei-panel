/*
    Title: Nei-Panel
    Author: Neimark Junsay Braga
    Date: 9/25/17
    Version: 1.0.0
*/
$.fn.neipanel = function(a) {
    var element = this;
    var onSwipe = function (el, callback){
        var touchsurface = el,
            swipedir,
            startX,
            startY,
            distX,
            distY,
            threshold = 150,
            restraint = 100,
            allowedTime = 300,
            elapsedTime,
            startTime,
            handleswipe = callback || function(swipedir){};

        touchsurface.addEventListener('touchstart', function(e){
            var touchobj = e.changedTouches[0];
            swipedir = null;
            startX = touchobj.pageX;
            startY = touchobj.pageY;
            startTime = new Date().getTime();
            e.preventDefault()
        }, false);

        touchsurface.addEventListener('touchmove', function(e){
            e.preventDefault();
        }, false);

        touchsurface.addEventListener('touchend', function(e){
            var touchobj = e.changedTouches[0];
            distX = touchobj.pageX - startX;
            distY = touchobj.pageY - startY;
            elapsedTime = new Date().getTime() - startTime;
            if (elapsedTime <= allowedTime){
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint)
                    swipedir = (distX < 0)? 'left' : 'right';
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint)
                    swipedir = (distY < 0)? 'up' : 'bottom';
            }
            handleswipe(swipedir);
            e.preventDefault()
        }, false)
    };
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
        option.iconSize = option.iconSize || '10px';
        option.iconColor = option.iconColor || 'rgb(75,75,75)';
        option.zIndex = option.zIndex || 3;
        option.backdropOpacity = option.backdropOpacity || '.5';
        option.swipe = (option.swipe == undefined)? true:option.swipe;
        option.backdrop = (option.backdrop == undefined)? true:option.backdrop;
        option.displayHideBar = (option.displayHideBar == undefined)? true:option.displayHideBar;
        var disableElements = [];
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
            .attr('class', option.hideIconClass);
            //.css('font-size', option.hideBarSize)
            //.html(hideIcon());
        for(temp in pos){
            if(temp == oppsitePosition(option.position)) $(elements.hideIcon).css('border-' + temp, option.iconSize + ' solid ' + option.iconColor);
            else if(temp != option.position) $(elements.hideIcon).css('border-' + temp, option.iconSize + ' solid transparent');
        }

        $(elements.buttonBar)
            .attr('class', option.hideBarClass)
            .css('background-color', 'rgba(255,255,255,.5)')
            .css('justify-content','center')
            .css('align-items','center')
            .css('overflow', 'hidden')
            .css('cursor','pointer')
            .css('position','fixed')
            .css('display', (option.displayHideBar)? 'flex':'none')
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
            .css('top', '-105%')
            .css('right', '0')
            .css('bottom', '0')
            .css('left', '0')
            .on('click', function () {if(option.backdrop) neiPanel.hide();});
        onSwipe(elements.backdrop, function (direction) {
            if(direction == option.direction && option.swipe) neiPanel.hide();
        });

        $('body')
            .append(elements.panel)
            .append(elements.buttonBar)
            .append(elements.backdrop);

        this.show = function () {
            var handler = function (e) {
                if(!e.isDefaultPrevented()){
                    $(elements.backdrop).css('top', '0');
                    var nonPanelElements = $('body *')
                        .not($(elements.panel))
                        .not($(elements.panel).find('*'))
                        .not($(elements.buttonBar))
                        .not($(elements.buttonBar).find('*'))
                        .not($(elements.backdrop))
                        .not('script');

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

                    for(var i = 0; i < nonPanelElements.length; i++) if(nonPanelElements[i].tabIndex > -1) {
                        disableElements.push([nonPanelElements[i], nonPanelElements[i].tabIndex]);
                        nonPanelElements[i].tabIndex = '-1';
                    }
                }
                $(element).off('neipanel.show', handler)
            };
            $(element).on('neipanel.show', handler);
            $(element).trigger({type: 'neipanel.show'});
        };
        this.hide = function () {
            var handler = function (e) {
                if(!e.isDefaultPrevented()){
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
                    }, option.hideDuration, 'swing', function () {
                        $(elements.backdrop).css('top', '-105%');
                    });

                    for(var i = 0; i < disableElements.length; i++)
                        disableElements[i][0].tabIndex = (disableElements[i][1] == '-1')? undefined:disableElements[i][1];
                    disableElements = [];
                }
                $(element).off('neipanel.hide', handler);
            };
            $(element).on('neipanel.hide', handler);
            $(element).trigger({type: "neipanel.hide"});
        };
    };
    if(a.constructor != String) $(element).data('neipanel', new NeiPanel(a));
    else if($(element).data('neipanel')) $(element).data('neipanel')[a]();
};