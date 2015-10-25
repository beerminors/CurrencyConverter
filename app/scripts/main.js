var CONVERTER = (function (cc, $, Modernizr) {

	"use strct";
	var 
		dragging = false,
		ccRate = 0,
		dataUrl = "https://jsonp.afeld.me/?callback=foo&url=https%3A%2F%2Fs3-ap-southeast-2.amazonaws.com%2Fubiquity-utilities%2Ffrontend_test%2Fcurrencies.json",
		$screenContainer = $(".screen-digit"),
		$currFromInput = $("#currency-from"),
		$currToInput = $("#currency-to"),
		$currSwitcher = $(".currency-switcher"),
		$labelfrom = $screenContainer.find(".label-from"),
		$labelto = $screenContainer.find(".label-to"),
		assets = [],

	_bindSnap = function() {
	    // force load resize
	    $(window).on("load resize", function () {
		    if (Modernizr.mq('all and (max-width: 768px)')) {
		        // The function that will initialize your Snap.js instance
				if(window.snapper) {
		         // Snap.js already exists, we just need to re-bind events
			        window.snapper.enable();
			    } else {
			        // Initialize Snap.js
			        window.snapper = new Snap({
			            element: document.getElementById('content'),
			            disable: 'right'
			        });

			        $("#open-left").on("click", function(e) {
						e.preventDefault();
						window.snapper.open('left');
			        });
			    } 
			    window.addEventListener('push', _bindSnap);
		    }
		    else {
		        if(window.snapper) {
		            window.snapper.close();
		            window.snapper.disable();
		        }
		    }
	    });
	},

	_bindKeypress = function() {
		$("#currency-from").autoNumeric('init', {vMax: 99999.99});
		$("#currency-to").autoNumeric('init');
		$("#screen_keys").delegate('.key-input', 'touchend click', function(el) {
			el.preventDefault();
			
			if (dragging) { return; }
			ccRate = $currSwitcher.find("a.selected").data("currency-rate");
			var e = $.Event("keypress");
			e.ctrlKey = false;
			e.which = $(el.currentTarget).data("keychar"); // # Some key code value

			if(e.which == 8) {
				_bindBackspace($currFromInput);
			} else {
				$currFromInput.trigger(e);
			}

			_calculateRate(ccRate);

		});

		$currFromInput.on("keypress", function(e) {
			var $target = $(e.currentTarget).val();
		});
	},

	_calculateRate = function(rate) {
		var inputFromVal = $('#currency-from').autoNumeric('get');
			$currToInput.val(inputFromVal * rate).blur();
	},

	_bindBackspace = function(elem) {
		var str = elem.val();
		elem.val(str.substring(0, str.length - 1));
	},

	_bindSwitcher = function(data) {
		$currSwitcher.find("[data-currency-rate]").each(function(i, el) {
			assets.push(data[i].from_icon);
			$(el).attr("data-currency-rate", data[i].ratio)
				.attr("data-currency-label", data[i].menu_label)
				.attr("data-currency-from", data[i].from_label)
				.attr("data-currency-to", data[i].to_label)
				.text(data[i].menu_label);
		});

		// bind event to currency switcher menu
		$currSwitcher.delegate("a", "click touchend", function(event) {
			event.preventDefault();
			if (dragging) { return; }
			var $target = $(event.currentTarget);
			// remove all active class
			$currSwitcher.find("a").removeClass("selected");
			// add new active class to el that's clicked
			$target.addClass("selected");
			// update calculator rate
			_calculateRate($target.data("currency-rate"));
			// updat to screen switching
			_updateDisplayScreen($target.data("currency-label"),
				$target.data("currency-from"),
				$target.data("currency-to"));
		});

		// to remove duplicate url from assets []
		var unpackAssets = [];
		$.each(assets, function(i, el){
		    if($.inArray(el, unpackAssets) === -1) unpackAssets.push(el);
		});

		_preloadImages(unpackAssets); // need to preload image assets there're not sprite
		_resetSwitcher();
	},

	_updateDisplayScreen = function(from_to, lb_from, lb_to) {
		switch (from_to) {
		    case "AUD > USD":
		        $labelfrom.removeClass("icon-usd icon-gbp")
	        			.addClass("icon-aud")
	        			.text(lb_from);
		        $labelto.removeClass("icon-aud icon-gbp")
		        		.addClass("icon-usd")
		        		.text(lb_to);
		        break;
		    case "USD > AUD":
		        $labelfrom.removeClass("icon-aud icon-gbp")
		        		.addClass("icon-usd")
		        		.text(lb_from);
		        $labelto.removeClass("icon-usd icon-gbp")
		        		.addClass("icon-aud")
		        		.text(lb_to);
		        break;
		    case "AUD > GBP":
		        $labelfrom.removeClass("icon-usd icon-gbp")
		        		.addClass("icon-aud")
		        		.text(lb_from);
		        $labelto.removeClass("icon-usd icon-aud")
		        		.addClass("icon-gbp")
		        		.text(lb_to);
		        break;
		    case "GBP > AUD":
		        $labelfrom.removeClass("icon-aud icon-usd")
		        		.addClass("icon-gbp")
		        		.text(lb_from);
		        $labelto.removeClass("icon-usd icon-gbp")
		        		.addClass("icon-aud")
		        		.text(lb_to);
		        break;
	        default:
	        	$labelfrom.removeClass("icon-usd icon-gbp")
	        			.addClass("icon-aud")
	        			.text(lb_from);
		        $labelto.removeClass("icon-aud icon-gbp")
		        		.addClass("icon-usd")
		        		.text(lb_to);
		        break;
		}
		// clear input 
		if($("#currency-to").autoNumeric('get') == 0) {
			$("#currency-to").val('');
		}	
	},

	_getRates = function() {
		$.ajax({
			url: dataUrl,
			dataType: "jsonp",
			contentType: "text/plain",
			type: "GET",
			cache: false,
			crossDomain: true,
			async: false,
			jsonpCallback: "foo",
			success: function(data) {
				if(data) {
					_bindSwitcher(data);
				}
			},
			error: function(xhr, status, error) {
				console.log(xhr, status, error, "\nNetwork Error: Lost connection, Try again later");
			}
		});
	},

	_resetSwitcher = function() {
		$currSwitcher.find("[data-currency-rate]").first().trigger("click");	
	},

	_touchDevice = function() {
		$("body").on("touchmove", function(){
		  	dragging = true;
		});
		$("body").on("touchstart", function(){
		    dragging = false;
		});
	},

	_preloadImages = function (array) {
	    if (!_preloadImages.list) {
	        _preloadImages.list = [];
	    }
	    var list = _preloadImages.list;
	    for (var i = 0; i < array.length; i++) {
	        var img = new Image();
	        img.onload = function() {
	            var index = list.indexOf(this);
	            if (index !== -1) {
	                // remove image from the array once it's loaded
	                // for memory consumption reasons
	                list.splice(index, 1);
	            }
	        }
	        list.push(img);
	        img.src = array[i];
	    }
	};

	cc._init = function() {
		if (Modernizr.touch) {
			_touchDevice(); // enhancing touch device
		}
		_getRates();
		_bindSnap();
		_bindKeypress();
	};


	return cc;
}(CONVERTER || {}, jQuery, Modernizr));
CONVERTER._init();








