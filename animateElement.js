(function(root, factory) {
    if(typeof module != 'undefined' && typeof exports == 'object') {
        module.exports = factory();
    } else {
        var obj = (root.$min == undefined) 
                    ? factory() : Object.assign(root.$min, factory());
        root.$min = obj;
    }
}(this, function() {
    var lib = {};

    lib.animateElement = function(elem, css, duration, callback) {

		elem.$isAnimate = true;

		duration = duration ? duration : 1000;

		var startTime = new Date().valueOf();
		var nowStyle = {}, nextStyle = {};

		for(var prop in css) {
			nowStyle[prop] = parseFloat(getStyle(elem, prop));
			if(!nowStyle[prop] || nowStyle[prop] == 'auto') nowStyle[prop] = 0;
			
			//움직여야하는 값 = 원하는 값 - 현재 값
			nextStyle[prop] = parseFloat(css[prop]) - nowStyle[prop];
		}

		function process() {
			if(elem.$isAnimate) {
				var passedTime = new Date().valueOf() - startTime;
				var percent = passedTime / duration;
				
				if(passedTime <= duration) {
					for(var prop in nextStyle) {
						var changePropVal = nowStyle[prop] + (nextStyle[prop] * percent);
						
						if(prop === 'width' || prop === 'height' || prop === 'left' || prop === 'top')
							elem.style[prop] = changePropVal + 'px';
						else
							elem.style[prop] = changePropVal;
					}

					setTimeout(process, 0);
				} else {
					for(var prop in css) {
						if(prop === 'width' || prop === 'height' || prop === 'left' || prop === 'top')
							elem.style[prop] = css[prop] + 'px';
						else 
							elem.style[prop] = css[prop];
					}

					if(typeof callback === 'function') {
						callback(elem, css);
					}
				}
			}
		}

		process();

		function getStyle(elem, styleName) {
			if(elem.currentStyle) {
				return elem.currentStyle[styleName];
			} else if(document.defaultView && document.defaultView.getComputedStyle) {
				styleName = styleName.toLowerCase();

				return document.defaultView.getComputedStyle(elem, null).getPropertyValue(styleName);
			} else {
				return null;
			}
		};
	};

    return lib;
}));