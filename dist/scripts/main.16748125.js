var CONVERTER=function(a,b,c){"use strct";var d=!1,e=0,f="https://jsonp.afeld.me/?callback=foo&url=https%3A%2F%2Fs3-ap-southeast-2.amazonaws.com%2Fubiquity-utilities%2Ffrontend_test%2Fcurrencies.json",g=b(".screen-digit"),h=b("#currency-from"),i=b("#currency-to"),j=b(".currency-switcher"),k=g.find(".label-from"),l=g.find(".label-to"),m=[],n=function(){b(window).on("load resize",function(){c.mq("all and (max-width: 768px)")?(window.snapper?window.snapper.enable():(window.snapper=new Snap({element:document.getElementById("content"),disable:"right"}),b("#open-left").on("click",function(a){a.preventDefault(),window.snapper.open("left")})),window.addEventListener("push",n)):window.snapper&&(window.snapper.close(),window.snapper.disable())})},o=function(){b("#currency-from").autoNumeric("init",{vMax:99999.99}),b("#currency-to").autoNumeric("init")},p=function(){b("#screen_keys").delegate(".key-input","touchend click",function(a){if(a.preventDefault(),!d){e=j.find("a.selected").data("currency-rate");var c=b.Event("keypress");c.ctrlKey=!1,c.which=b(a.currentTarget).data("keychar"),8==c.which?r(h):h.trigger(c),q(e)}}),h.on("keypress",function(a){b(a.currentTarget).val()})},q=function(a){var c=b("#currency-from").autoNumeric("get");i.val(c*a).blur()},r=function(a){var b=a.val();a.val(b.substring(0,b.length-1))},s=function(a){j.find("[data-currency-rate]").each(function(c,d){m.push(a[c].from_icon),b(d).attr("data-currency-rate",a[c].ratio).attr("data-currency-label",a[c].menu_label).attr("data-currency-from",a[c].from_label).attr("data-currency-to",a[c].to_label).text(a[c].menu_label)}),j.delegate("a","click touchend",function(a){if(a.preventDefault(),!d){var c=b(a.currentTarget);j.find("a").removeClass("selected"),c.addClass("selected"),q(c.data("currency-rate")),t(c.data("currency-label"),c.data("currency-from"),c.data("currency-to"))}});var c=[];b.each(m,function(a,d){-1===b.inArray(d,c)&&c.push(d)}),x(c),v(),p()},t=function(a,c,d){switch(a){case"AUD > USD":k.removeClass("icon-usd icon-gbp").addClass("icon-aud").text(c),l.removeClass("icon-aud icon-gbp").addClass("icon-usd").text(d);break;case"USD > AUD":k.removeClass("icon-aud icon-gbp").addClass("icon-usd").text(c),l.removeClass("icon-usd icon-gbp").addClass("icon-aud").text(d);break;case"AUD > GBP":k.removeClass("icon-usd icon-gbp").addClass("icon-aud").text(c),l.removeClass("icon-usd icon-aud").addClass("icon-gbp").text(d);break;case"GBP > AUD":k.removeClass("icon-aud icon-usd").addClass("icon-gbp").text(c),l.removeClass("icon-usd icon-gbp").addClass("icon-aud").text(d);break;default:k.removeClass("icon-usd icon-gbp").addClass("icon-aud").text(c),l.removeClass("icon-aud icon-gbp").addClass("icon-usd").text(d)}0==b("#currency-to").autoNumeric("get")&&b("#currency-to").val("")},u=function(){b.ajax({url:f,dataType:"jsonp",contentType:"text/plain",type:"GET",cache:!1,crossDomain:!0,async:!1,jsonpCallback:"foo",success:function(a){a&&s(a)},error:function(a,b,c){console.log(a,b,c,"\nNetwork Error: Lost connection, Try again later")}})},v=function(){j.find("[data-currency-rate]").first().trigger("click")},w=function(){b("body").on("touchmove",function(){d=!0}),b("body").on("touchstart",function(){d=!1})},x=function(a){x.list||(x.list=[]);for(var b=x.list,c=0;c<a.length;c++){var d=new Image;d.onload=function(){var a=b.indexOf(this);-1!==a&&b.splice(a,1)},b.push(d),d.src=a[c]}};return a._init=function(){c.touch&&w(),o(),u(),n()},a}(CONVERTER||{},jQuery,Modernizr);CONVERTER._init();