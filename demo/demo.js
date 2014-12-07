var selectedtag = ""
var newdata
var redo
Ext.require('Ext.ux.Cover');
var title
var bodi


$.event.special.tap = {
  setup: function() {
    var self = this,
      $self = $(self);

    $self.on('touchstart', function(startEvent) {
      var target = startEvent.target;

      $self.one('touchend', function(endEvent) {
        if (target == endEvent.target) {
          $.event.simulate('tap', self, endEvent);
        }
      });
    });
  }
};



function openpost(theid) {
	$('#newspaper').html("");
        $(".news-scroller").addClass("newsopen");
        $('.x-container').addClass("containeropen")
    $.getJSON("http://api.tumblr.com/v2/blog/toucheydesign.tumblr.com/posts?api_key=9ETjAxgy8vdjD9iJhf1bEeLvO4ETFnZ3lvNSma2JtQewBmeFIM&jsonp=?&id=" + theid, function (json) {
        //console.log("JSON Data: " + json.response.posts[3].title + json.response.posts.length);

        //bodyimg=$('<div>').append($($("img", $(json.response.posts[i].body))[0]).clone()).html();

        title = json.response.posts[0].title;
        image = "";
        bodi = json.response.posts[0].body;

        posthtml = bodi;
        posttitle = title;
        
         

        setTimeout(function () {
            myScroll.refresh();
            $('#newspaper').html('<div class="title">' + posttitle + '</div>' + posthtml);
        }, 1000);

        //remove first img + remove a img links + add new links for photoswipe
        setTimeout(function () {

            $("#newspaper img:first").remove()
            testi = $("#newspaper a:has(img)").attr('href');
            if (testi == undefined) {
                $('#newspaper img').each(function () {
                    var $this = $(this);
                    $this.wrap("<div class='loadingimgs'></div>");
                    $this.wrap("<a class='linkclass'/>");
                    $this.parent('.linkclass').attr("href", $this.attr('src'));
                });
            } else {
                cmatch = testi.search(/bit/ig);
                if (cmatch == -1) {
                    $("a:has(img)").each(function () {
                        $(this).replaceWith($(this).children());
                    })
                    $('#newspaper img').each(function () {
                        var $this = $(this);
                        $this.wrap("<div class='loadingimgs'></div>");
                        $this.wrap("<a class='linkclass'/>");
                        $this.parent('.linkclass').attr("href", $this.attr('src'));
                    });
                } else {
                    $('#newspaper img').each(function () {
                        var $this = $(this);
                        $this.wrap("<div class='loadingimgs'></div>");
                    });
                }
            }

            /// Fade imgs	

            $('#newspaper img').animate({
                opacity: "0",
            }, 0, 'linear');
            $('#newspaper img').load(function () {
                $(this).animate({
                    opacity: "1",
                }, 500, 'linear');
            });

            /// Initialise Photoswipe
            var myPhotoSwipe = $("#newspaper a:has(img)").photoSwipe({
                enableMouseWheel: false,
                enableKeyboard: false
            })



        }, 1000);
    });
}

///COVERFLOW MODULE

Ext.application({
    name: 'Cover',
    viewport: {
        autoMaximize: true,
    },
    launch: function () {
        var cover = Ext.create('Ext.ux.Cover', {
            itemCls: 'my-cover-item',
            id: 'cover',
            //These are just for demo purposes.
            height: (Ext.os.deviceType !== 'Phone') ? 500 : undefined,
            width: (Ext.os.deviceType !== 'Phone') ? 800 : undefined,
            //end-demo
            itemTpl: ['<div style="z-index:300!important;">', '<div class="company">{title}</div>', '<div class="image" id="image">{body:ellipsis(190, true)}</div>', '</div>'],
            store: {
                autoLoad: true,
                fields: ['post_url', 'title', 'image', {
                    name: 'body',
                    type: 'string'
                }, ],
                proxy: {
                    extraParams: {
                        limit: 10
                    },
                    pageParam: null,
                    startParam: null,
                    type: 'jsonp',
                    url: 'http://api.tumblr.com/v2/blog/toucheydesign.tumblr.com/posts?api_key=9ETjAxgy8vdjD9iJhf1bEeLvO4ETFnZ3lvNSma2JtQewBmeFIM&jsonp=Ext.data.JsonP.callback1&offset=0',
                    reader: {
                        type: 'json',
                        rootProperty: 'response.posts'
                    }

                }

            },

            selectedIndex: 0,
            listeners: {


                ////////////////
                /////////////////
                ///// ITEM TAP //////////////////
                /////////////////////
                ////////////
                itemtap: function (cover, index, target, record, event) {

                    //get more items + show loading
                    var allitems = cover.getStore().getCount();
                    //console.log(allitems);
                    //check if this is the last item selected
                    if (index == allitems - 1) {
                        //console.log("this is the last item");
                        $(".right-loader").animate({
                            right: "-10px",
                        }, 500, 'linear');
                        setTimeout(function () {
                            $(".right-loader").animate({
                                right: "-200px",
                            }, 500, 'linear');
                        }, 5000);

                        /// add 5 more items
                        //console.log("&offset="+allitems+"&limit=5&tag="+selectedtag);
                        loadmore();
                        redo = loadmore;
                    } else {
                        ///empty else	
                    };


                    //open post fill in the post body and title

                    //console.log(cover.selectedIndex, index )
                    if (cover.selectedIndex == index) {
						console.log(record.get('id'))
                        openpost(record.get('id'))

                    }
                },
                ////////////////
                /////////////////
                ///// ITEM DRAG //////////////////
                /////////////////////
                ////////////
                itemtouchend: function (cover, index, target, record, event) {
                    //console.log('component was dragged on the Data View');


                    //get more items + show loading
                    var allitems = cover.getStore().getCount();
                    //console.log(allitems);
                    //check if this is the last item selected
                    if (cover.selectedIndex == allitems - 1) {
                        //console.log("this is the last item");
                        $(".right-loader").animate({
                            right: "-10px",
                        }, 500, 'linear');
                        setTimeout(function () {
                            $(".right-loader").animate({
                                right: "-200px",
                            }, 500, 'linear');
                        }, 5000);

                        /// add more items
                        loadmore();
                        redo = loadmore;



                    }


                },


                scope: this
            }
        });

        var tab = Ext.create('Ext.tab.Panel', {
            tabBarPosition: 'bottom',
            items: [{
                title: 'cover',
                iconCls: 'favorites',
                //Demo purpose
                layout: (Ext.os.deviceType === 'Phone') ? 'fit' : {
                    type: 'vbox',
                    pack: 'center',
                    align: 'center'
                },
                //end demo
                items: [cover]
            }]
        });




        ////// fade images




        //////////////
        Ext.Viewport.on('orientationchange', function () {

            $(".menu-b").animate({
                bottom: 120 - $('.menu-b').height() + "px",
            }, 200);
            //cover.refresh();
        })
        Ext.Viewport.add(tab);
    }
});


///LOADMORE FUNCTION -- TO LOAD ITEMS IN TO VIEW ////
function loadmore() {
    checkConnection()
    var allitems = Ext.getCmp('cover').getStore().getCount();
    $.getJSON("http://api.tumblr.com/v2/blog/toucheydesign.tumblr.com/posts?api_key=9ETjAxgy8vdjD9iJhf1bEeLvO4ETFnZ3lvNSma2JtQewBmeFIM&jsonp=?&offset=" + allitems + "&limit=10&tag=" + selectedtag, function (json) {
        //console.log("JSON Data: " + json.response.posts[3].title + json.response.posts.length);
        for (i = 0; i < json.response.posts.length; i++) {
            //bodyimg=$('<div>').append($($("img", $(json.response.posts[i].body))[0]).clone()).html();
            Ext.getCmp('cover').getStore().add({
                'title': json.response.posts[i].title,
                'image': "",
                'body': json.response.posts[i].body,
				'id': json.response.posts[i].id
            });

        }
        Ext.getCmp('cover').refresh();
    });
}




///EZ MARK
(function ($) {
    $.fn.ezMark = function (options) {
        options = options || {};
        var defaultOpt = {
            checkboxCls: options.checkboxCls || 'ez-checkbox',
            radioCls: options.radioCls || 'ez-radio',
            checkedCls: options.checkedCls || 'ez-checked',
            selectedCls: options.selectedCls || 'ez-selected',
            hideCls: 'ez-hide'
        };
        return this.each(function () {
            var $this = $(this);
            var wrapTag = $this.attr('type') == 'checkbox' ? '<div class="' + defaultOpt.checkboxCls + '">' : '<div class="' + defaultOpt.radioCls + '">';
            if ($this.attr('type') == 'checkbox') {
                $this.addClass(defaultOpt.hideCls).wrap(wrapTag).change(function () {
                    if ($(this).is(':checked')) {
                        $(this).parent().addClass(defaultOpt.checkedCls);
                    } else {
                        $(this).parent().removeClass(defaultOpt.checkedCls);
                    }
                });
                if ($this.is(':checked')) {
                    $this.parent().addClass(defaultOpt.checkedCls);
                }
            } else if ($this.attr('type') == 'radio') {
                $this.addClass(defaultOpt.hideCls).wrap(wrapTag).change(function () {
                    $('input[name="' + $(this).attr('name') + '"]').each(function () {
                        if ($(this).is(':checked')) {
                            $(this).parent().addClass(defaultOpt.selectedCls);
                        } else {
                            $(this).parent().removeClass(defaultOpt.selectedCls);
                        }
                    });
                });
                if ($this.is(':checked')) {
                    $this.parent().addClass(defaultOpt.selectedCls);
                }
            }
        });
    }
})(jQuery);



// enable ipad label click
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i)) {
    $(document).ready(function () {
        $('label[for]').click(function () {
            var el = $(this).attr('for');
            if ($('#' + el + '[type=radio], #' + el + '[type=checkbox]').attr('selected', !$('#' + el).attr('selected'))) {
                return;
            } else {
                $('#' + el)[0].focus();
            }
        });
    });
}



//filter data
$(document).ready(function () {
    $("*:radio").unbind("click").click(function (evt) {
        evt.stopPropagation();
        var value = $('input[name=tag]:checked', '#tagz').val();
        selectedtag = value;
        redo = ""
        checkConnection();
        $(".news-scroller").removeClass("newsopen");
        $('.x-container').removeClass("containeropen");
        $(".menu-b").animate({
            bottom: 120 - $('.menu-b').height() + "px",
        }, 200);
        checkConnection()
        $.getJSON("http://api.tumblr.com/v2/blog/toucheydesign.tumblr.com/posts?api_key=9ETjAxgy8vdjD9iJhf1bEeLvO4ETFnZ3lvNSma2JtQewBmeFIM&jsonp=?&limit=10&tag=" + selectedtag, function (json) {
            Ext.getCmp('cover').getStore().removeAll();
            for (i = 0; i < json.response.posts.length; i++) {
                //  bodyimg=$('<div>').append($($("img", $(json.response.posts[i].body))[0]).clone()).html();
                Ext.getCmp('cover').getStore().add({
                    'title': json.response.posts[i].title,
                    'image': "",
                    'body': json.response.posts[i].body
                });

            }


            Ext.getCmp('cover').refresh();
        });
        Ext.getCmp('cover').selectedIndex = 0;
    });
});

//CHECK FOR INTERNET

function mafiinternet() {
    //alert("mafi");
    $(".alert-overlay").show();
}


function fiinternet() {
    //alert("fi");
    $(".alert-overlay").hide();
}



function checkConnection() {
    var testing = '<img id="testImage" style="display: none;" src="http://www.touchey.net/test.jpg?' + Math.random() + '" ' + 'onerror="mafiinternet();" onload="fiinternet();">';
    $("#body").append(testing);

}



$(".alert-overlay").live("click", function () {
    $(".alert-overlay").hide();
    setTimeout(function () {
        checkConnection();
        if (redo = loadmore) {
            loadmore();
        }
    }, 2000);

});
checkConnection()

function retry() {
    $(".alert-overlay").hide();
    setTimeout(function () {
        checkConnection();
        if (redo = loadmore) {
            loadmore();
        }
    }, 2000);
}