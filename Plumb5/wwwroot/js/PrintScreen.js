
(function ($) {

    $.feedback = function (options) {

        var settings = $.extend({
            ajaxURL: '',
            postBrowserInfo: true,
            postHTML: true,
            postURL: true,
            proxy: undefined,
            letterRendering: false,
            initButtonText: 'Send feedback',
            strokeStyle: 'black',
            shadowColor: 'black',
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 10,
            lineJoin: 'bevel',
            lineWidth: 3,
            html2canvasURL: 'html2canvas.js',
            feedbackButton: '.btnReport',
            showDescriptionModal: true,
            isDraggable: true,
            onScreenshotTaken: function () { },
            tpl: {

                highlighter: '<div id="feedback-highlighter"><div class="feedback-logo">Report a bug</div><p style="color: #888;"><textarea id="message"  placeholder="Your Message To Us" style="width:100%;height:100px;font-size: 14px;color:#000;" class="inputtextbox"></textarea>Click and drag on the page to help us better understand your feedback. You can move this dialog if it\'s in the way.</p><div class="feedback-buttons"><button id="feedback-highlighter-next" class="button">Post</button><button id="feedback-highlighter-back" class="feedback-back-btn feedback-btn-gray">Back</button></div><div class="feedback-wizard-close"></div></div>',
                overview: '',
            },
            onClose: function () { },
            screenshotStroke: true,
            highlightElement: true,
            initialBox: false
        }, options);
        var supportedBrowser = !!window.HTMLCanvasElement;
        var isFeedbackButtonNative = settings.feedbackButton == '.btnReport';
        var _html2canvas = false;
        if (supportedBrowser) {
            
            $(document).on('click', settings.feedbackButton, function () {

                
                
                //if (isFeedbackButtonNative) {
                //    $(this).hide();
                //}
                if (!_html2canvas) {
                    $.getScript(settings.html2canvasURL, function () {
                        _html2canvas = true;
                    });
                }
                var canDraw = false,
					img = '',
					h = $(document).height(),
					w = $(document).width(),
					tpl = '<div id="feedback-module">';

                if (settings.initialBox) {
                    tpl += settings.tpl.description;
                }

                tpl += settings.tpl.highlighter + settings.tpl.overview + '<canvas id="feedback-canvas"></canvas><div id="feedback-helpers"></div><input id="feedback-note" name="feedback-note" type="hidden"></div>';

                $('body').append(tpl);
               

                moduleStyle = {
                    'position': 'absolute',
                    'left': '0px',
                    'top': '0px'
                };
                canvasAttr = {
                    'width': w,
                    'height': h
                };

                $('#feedback-module').css(moduleStyle);
                $('#feedback-canvas').attr(canvasAttr).css('z-index', '30000');

                if (!settings.initialBox) {
                    $('#feedback-highlighter-back').remove();
                    canDraw = true;
                    $('#feedback-canvas').css('cursor', 'crosshair');
                    $('#feedback-helpers').show();
                    $('#feedback-welcome').hide();
                    $('#feedback-highlighter').show();
                }

                if (settings.isDraggable) {
                    $('#feedback-highlighter').on('mousedown', function (e) {
                        var $d = $(this).addClass('feedback-draggable'),
							drag_h = $d.outerHeight(),
							drag_w = $d.outerWidth(),
							pos_y = $d.offset().top + drag_h - e.pageY,
							pos_x = $d.offset().left + drag_w - e.pageX;
                        $d.css('z-index', 40000).parents().on('mousemove', function (e) {
                            _top = e.pageY + pos_y - drag_h;
                            _left = e.pageX + pos_x - drag_w;
                            _bottom = drag_h - e.pageY;
                            _right = drag_w - e.pageX;

                            if (_left < 0) _left = 0;
                            if (_top < 0) _top = 0;
                            if (_right > $(window).width())
                                _left = $(window).width() - drag_w;
                            if (_left > $(window).width() - drag_w)
                                _left = $(window).width() - drag_w;
                            if (_bottom > $(document).height())
                                _top = $(document).height() - drag_h;
                            if (_top > $(document).height() - drag_h)
                                _top = $(document).height() - drag_h;

                            $('.feedback-draggable').offset({
                                top: _top,
                                left: _left
                            }).on("mouseup", function () {
                                $(this).removeClass('feedback-draggable');
                            });
                        });
                        //e.preventDefault();
                    }).on('mouseup', function () {
                        $(this).removeClass('feedback-draggable');
                        $(this).parents().off('mousemove mousedown');
                    });
                }

                var ctx = $('#feedback-canvas')[0].getContext('2d');

                ctx.fillStyle = 'rgba(102,102,102,0.5)';
                ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());

                rect = {};
                drag = false;
                highlight = 1,
				post = {};

                if (settings.postBrowserInfo) {
                    post.browser = {};
                    post.browser.appCodeName = navigator.appCodeName;
                    post.browser.appName = navigator.appName;
                    post.browser.appVersion = navigator.appVersion;
                    post.browser.cookieEnabled = navigator.cookieEnabled;
                    post.browser.onLine = navigator.onLine;
                    post.browser.platform = navigator.platform;
                    post.browser.userAgent = navigator.userAgent;
                    post.browser.plugins = [];

                    $.each(navigator.plugins, function (i) {
                        post.browser.plugins.push(navigator.plugins[i].name);
                    });
                    $('#feedback-browser-info').show();
                }

                if (settings.postURL) {
                    post.url = document.URL;
                    $('#feedback-page-info').show();
                }

                if (settings.postHTML) {
                    post.html = $('html').html();
                    $('#feedback-page-structure').show();
                }

                if (!settings.postBrowserInfo && !settings.postURL && !settings.postHTML)
                    $('#feedback-additional-none').show();

                $(document).on('mousedown', '#feedback-canvas', function (e) {
                    if (canDraw) {

                        rect.startX = e.pageX - $(this).offset().left;
                        rect.startY = e.pageY - $(this).offset().top;
                        rect.w = 0;
                        rect.h = 0;
                        drag = true;
                    }
                });

                $(document).on('mouseup', function () {
                    if (canDraw) {
                        drag = false;

                        var dtop = rect.startY,
							dleft = rect.startX,
							dwidth = rect.w,
							dheight = rect.h;
                        dtype = 'highlight';

                        if (dwidth == 0 || dheight == 0) return;

                        if (dwidth < 0) {
                            dleft += dwidth;
                            dwidth *= -1;
                        }
                        if (dheight < 0) {
                            dtop += dheight;
                            dheight *= -1;
                        }

                        if (dtop + dheight > $(document).height())
                            dheight = $(document).height() - dtop;
                        if (dleft + dwidth > $(document).width())
                            dwidth = $(document).width() - dleft;

                        if (highlight == 0)
                            dtype = 'blackout';

                        $('#feedback-helpers').append('<div class="feedback-helper" data-type="' + dtype + '" data-time="' + Date.now() + '" style="position:absolute;top:' + dtop + 'px;left:' + dleft + 'px;width:' + dwidth + 'px;height:' + dheight + 'px;z-index:30000;"></div>');

                        redraw(ctx);
                        rect.w = 0;
                    }

                });

                $(document).on('mousemove', function (e) {
                    if (canDraw && drag) {
                        $('#feedback-highlighter').css('cursor', 'default');

                        rect.w = (e.pageX - $('#feedback-canvas').offset().left) - rect.startX;
                        rect.h = (e.pageY - $('#feedback-canvas').offset().top) - rect.startY;

                        ctx.clearRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                        ctx.fillStyle = 'rgba(102,102,102,0.5)';
                        ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                        $('.feedback-helper').each(function () {
                            if ($(this).attr('data-type') == 'highlight')
                                drawlines(ctx, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                        });
                        if (highlight == 1) {
                            drawlines(ctx, rect.startX, rect.startY, rect.w, rect.h);
                            ctx.clearRect(rect.startX, rect.startY, rect.w, rect.h);
                        }
                        $('.feedback-helper').each(function () {
                            if ($(this).attr('data-type') == 'highlight')
                                ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                        });
                        $('.feedback-helper').each(function () {
                            if ($(this).attr('data-type') == 'blackout') {
                                ctx.fillStyle = 'rgba(0,0,0,1)';
                                ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                            }
                        });
                        if (highlight == 0) {
                            ctx.fillStyle = 'rgba(0,0,0,0.5)';
                            ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
                        }
                    }
                });

                if (settings.highlightElement) {
                    var highlighted = [],
						tmpHighlighted = [],
						hidx = 0;

                    
                }


              

                $(document).on('mouseenter mouseleave', '.feedback-helper', function (e) {
                    if (drag)
                        return;

                    rect.w = 0;
                    rect.h = 0;

                    if (e.type === 'mouseenter') {
                        $(this).css('z-index', '30001');
                        $(this).append('<div class="feedback-helper-inner" style="width:' + ($(this).width() - 2) + 'px;height:' + ($(this).height() - 2) + 'px;position:absolute;margin:1px;"></div>');
                        $(this).append('<div id="feedback-close"></div>');
                        $(this).find('#feedback-close').css({
                            'top': -1 * ($(this).find('#feedback-close').height() / 2) + 'px',
                            'left': $(this).width() - ($(this).find('#feedback-close').width() / 2) + 'px'
                        });

                        if ($(this).attr('data-type') == 'blackout') {
                            /* redraw white */
                            ctx.clearRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                            ctx.fillStyle = 'rgba(102,102,102,0.5)';
                            ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
                            $('.feedback-helper').each(function () {
                                if ($(this).attr('data-type') == 'highlight')
                                    drawlines(ctx, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                            });
                            $('.feedback-helper').each(function () {
                                if ($(this).attr('data-type') == 'highlight')
                                    ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                            });

                            ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                            ctx.fillStyle = 'rgba(0,0,0,0.75)';
                            ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());

                            ignore = $(this).attr('data-time');

                            /* redraw black */
                            $('.feedback-helper').each(function () {
                                if ($(this).attr('data-time') == ignore)
                                    return true;
                                if ($(this).attr('data-type') == 'blackout') {
                                    ctx.fillStyle = 'rgba(0,0,0,1)';
                                    ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height())
                                }
                            });
                        }
                    }
                    else {
                        $(this).css('z-index', '30000');
                        $(this).children().remove();
                        if ($(this).attr('data-type') == 'blackout') {
                            redraw(ctx);
                        }
                    }
                });

                $(document).on('click', '#feedback-close', function () {
                    if (settings.highlightElement && $(this).parent().attr('data-highlight-id'))
                        var _hidx = $(this).parent().attr('data-highlight-id');

                    $(this).parent().remove();

                    if (settings.highlightElement && _hidx)
                        $('[data-highlight-id="' + _hidx + '"]').removeAttr('data-highlighted').removeAttr('data-highlight-id');

                    redraw(ctx);
                });

                $('#feedback-module').on('click', '.feedback-wizard-close,.feedback-close-btn', function () {
                    close();
                });



                $(document).on('click', '#feedback-highlighter-next', function ()  {
                   
                 
                    
                    if ($("#message").val() == '') {
                        ShowErrorMessage("Please Enter Your Query!!");

                    }
                    else
                    {
                        canDraw = false;
                        $('#feedback-canvas').css('cursor', 'default');
                        var sy = $(document).scrollTop(), dh = $(window).height();

                        $('#feedback-helpers').hide();
                        $('#feedback-highlighter').hide();

                        if (!settings.screenshotStroke) {
                            redraw(ctx, false);
                        }

                        html2canvas($('body'), {
                        onrendered: function (canvas) {
                            if (!settings.screenshotStroke) {
                                redraw(ctx);
                            }
                            _canvas = $('<canvas id="feedback-canvas-tmp" width="' + w + '" height="' + dh + '"/>').hide().appendTo('body');
                            _ctx = _canvas.get(0).getContext('2d');
                            _ctx.drawImage(canvas, 0, sy, w, dh, 0, 0, w, dh);
                            img = _canvas.get(0).toDataURL();
                            //window.open(img);

                           
                          

                            var appname = $(".btnReport").attr("appname");

                            var AccountName = "";
                            if (appname == "My Accounts") {
                                AccountName = "Accounts";
                            }

                            $.ajax({
                                url: "/Ticket/InsertTickets",
                                type: 'POST',
                                data: "{'Query':'" + $('#message').val() + "','AppType':'" + appname + "','CustomizationStatus':0,'AccountName':'" + AccountName + "','Attachment':'" + img + "'}",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (response) {

                                    $('#message').val('');
                                    ShowErrorMessage("Posted Sucessfully!!");
                                },
                                error: function (objxmlRequest, textStatus, errorThrown) {
                                }
                            });


                            $('#feedback-module').remove();
                            close();
                            _canvas.remove();
                            

                        },
                        proxy: settings.proxy,
                        letterRendering: settings.letterRendering
                    });
                }
                });



            });
        }

        function close() {
            canDraw = false;
            $(document).off('mouseenter mouseleave', '.feedback-helper');
            $(document).off('mouseup keyup');
            $(document).off('mousedown', '.feedback-setblackout');
            $(document).off('mousedown', '.feedback-sethighlight');
            $(document).off('mousedown click', '#feedback-close');
            $(document).off('mousedown', '#feedback-canvas');
            $(document).off('click', '#feedback-highlighter-next');
            $(document).off('click', '#feedback-highlighter-back');
            $(document).off('click', '#feedback-welcome-next');
            $(document).off('click', '#feedback-overview-back');
            $(document).off('mouseleave', 'body');
            $(document).off('mouseenter', '.feedback-helper');
            $(document).off('selectstart dragstart', document);
            $('#feedback-module').off('click', '.feedback-wizard-close,.feedback-close-btn');
            $(document).off('click', '#feedback-submit');

            if (settings.highlightElement) {
                $(document).off('click', '#feedback-canvas');
                $(document).off('mousemove', '#feedback-canvas');
            }
            $('[data-highlighted="true"]').removeAttr('data-highlight-id').removeAttr('data-highlighted');
            $('#feedback-module').remove();
            $('.btnReport').show();

            settings.onClose.call(this);
        }

        function redraw(ctx, border) {
            border = typeof border !== 'undefined' ? border : true;
            ctx.clearRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
            ctx.fillStyle = 'rgba(102,102,102,0.5)';
            ctx.fillRect(0, 0, $('#feedback-canvas').width(), $('#feedback-canvas').height());
            $('.feedback-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight')
                    if (border)
                        drawlines(ctx, parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
            });
            $('.feedback-helper').each(function () {
                if ($(this).attr('data-type') == 'highlight')
                    ctx.clearRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
            });
            $('.feedback-helper').each(function () {
                if ($(this).attr('data-type') == 'blackout') {
                    ctx.fillStyle = 'rgba(0,0,0,1)';
                    ctx.fillRect(parseInt($(this).css('left'), 10), parseInt($(this).css('top'), 10), $(this).width(), $(this).height());
                }
            });
        }

        function drawlines(ctx, x, y, w, h) {
            ctx.strokeStyle = settings.strokeStyle;
            ctx.shadowColor = settings.shadowColor;
            ctx.shadowOffsetX = settings.shadowOffsetX;
            ctx.shadowOffsetY = settings.shadowOffsetY;
            ctx.shadowBlur = settings.shadowBlur;
            ctx.lineJoin = settings.lineJoin;
            ctx.lineWidth = settings.lineWidth;

            ctx.strokeRect(x, y, w, h);

            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.lineWidth = 1;
        }

    };

}(jQuery));

pScreen();
function pScreen() {
    $.feedback({
        html2canvasURL: '/js/html2canvas.js'
    });
}
