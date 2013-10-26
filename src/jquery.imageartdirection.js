;(function ( $, window, document, undefined ) {			
	
	var settings,
		resizeTimer;

	$.fn.artDirectionCropResize = function ( options ) {
		//add passed in options to the defaults
		settings = $.extend( {}, $.fn.artDirectionCropResize.defaults, options );
		
		//add a resize event handler
		$(window).on('resize.artdirectioncropresize', $.proxy(handleWindowResize, this));

		//crop and resize all images
		return this.each(function() {
			cropAndResize(this);
		});
	};
	
	//plugin defaults – can be overloaded outside of the plugin
	$.fn.artDirectionCropResize.defaults = {
		cropRatio: "50%",
		windowResizeThreshold: 100,
		onCropResizeComplete: null
	};
	
	//handler for the window resize event.
	//this runs the crop/resize method on all images
	//and is debounced (100ms by default).
	function handleWindowResize()
	{
		var elements = this;
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			elements.each(function() {
					cropAndResize(this);
				});
		}, settings.windowResizeThreshold);
	}
	
	function cropAndResize(element)
	{
		var $element = $(element);

		//get the basic size details
		var fullImageWidth = element.naturalWidth;
		var fullImageHeight = element.naturalHeight;
		var currentImageWidth = $element.width();
		var currentImageHeight = $element.height();
		
		//get the focus point that is set for this image
		var focusPointCoordinates = $element.attr("data-artdirection-focus-point").split(",");
		var focusPointX = parseInt($.trim(focusPointCoordinates[0]));
		var focusPointY = parseInt($.trim(focusPointCoordinates[1]));

		//get the crop ratio for the current image
		var cropRatio = settings.cropRatio;
		if ($element.attr("data-artdirection-crop-ratio")) {
			cropRatio = $.trim($element.attr("data-artdirection-crop-ratio"));
		}
		cropRatio = cropRatio.replace('%', '') / 100;
		
		//calculations for resizing and crop
		var resizePercentage = (fullImageWidth - currentImageWidth) / fullImageWidth * 100;
		var cropPercentage = resizePercentage * cropRatio;
		var focusLeftTotal = focusPointX;
		var focusRightTotal = fullImageWidth - focusPointX;
		var focusTopTotal = focusPointY;
		var focusBottomTotal = fullImageHeight - focusPointY;
		var cropFromLeft = (focusLeftTotal * cropPercentage / 100);
		var cropFromRight = (focusRightTotal * cropPercentage / 100);
		var cropFromTop = (focusTopTotal * cropPercentage / 100);
		var cropFromBottom = (focusBottomTotal * cropPercentage / 100);
		var bgWidth = (currentImageWidth + cropFromLeft + cropFromRight);
		var bgResizePercentage = (fullImageWidth - bgWidth) / fullImageWidth * 100;
		var diffRight = ((currentImageWidth/2) - (focusPointX * (100-bgResizePercentage) / 100 - parseInt(cropFromLeft)));
		var diffLeft = ((currentImageWidth/2) - (focusPointX * (100-bgResizePercentage) / 100 - parseInt(cropFromRight)));
		
		//bring the focus point as close to the center of the image as possible
		if (diffRight < 0) { //the focus point is on the right side of the image
			var halfDiffRight = diffRight/2;
			cropFromLeft -= halfDiffRight;
			cropFromRight += halfDiffRight;
			if (cropFromLeft < 0) {
				cropFromRight += cropFromLeft;
				cropFromLeft = 0;
			}
			if (cropFromRight < 0) {
				cropFromLeft += cropFromRight;
				cropFromRight = 0;
			}
		} else if (diffLeft < 0) { //the focus point is on the left side of the image
			var halfDiffLeft = diffLeft/2;
			cropFromLeft += halfDiffLeft;
			cropFromRight -= halfDiffLeft;
			if (cropFromRight < 0) {
				cropFromLeft += cropFromRight;
				cropFromRight = 0;
			}	
			if (cropFromLeft < 0) {
				cropFromRight += cropFromLeft;
				cropFromLeft = 0;
			}
		}
		
		//make corrections to how much is cropped on each side,
		//this is for cases where the focus point is on far left
		//or far right of the image
		if (focusLeftTotal < currentImageWidth / 2) {
			cropFromRight += cropFromLeft;
			cropFromLeft = 0;
		} else if (focusRightTotal < currentImageWidth / 2) {
			cropFromLeft += cropFromRight;
			cropFromRight = 0;
		}
		
		//set up the X/Y position of the resized image
		var posLeft = cropFromLeft;
		var posTop = cropFromTop;
		//correct the left position to make sure we always fill in the right hand side
		if (cropFromLeft + currentImageWidth > fullImageWidth - cropFromLeft) {
			posLeft = cropFromLeft + cropFromRight;
		}
		
		//now that everything is calculated put a div around the target image
		var div;
		var alreadyWrapped = $element.parent('div.img-artdirection-wrapper').length == 1;
		if (!alreadyWrapped) {
			//if the img is not wrapped then create div and wrap around
			div = $("<div></div>").addClass('img-artdirection-wrapper');
		} else {
			//if the img is already wrapped then just update the css below
			div = $element.parent('div.img-artdirection-wrapper');
		}
		
		//set up the div with a background image.
		//this background is resized but is slightly bigger than the div,
		//so the parts that are overflowing are cropped
		div
			.css('width', '100%')
			.css('height', 'auto')
			.css('background-repeat', 'no-repeat')
			.css('background-image', 'url(' + $element.attr("src") + ')')
			.css('background-position', '-' + posLeft + 'px -' + posTop + 'px')
			.css('background-size', (currentImageWidth + cropFromLeft + cropFromRight) + 'px ' + 
									(currentImageHeight + cropFromTop + cropFromBottom) + 'px');

		//wrap the image with a div if not yet done (first run)
		if (!alreadyWrapped) {
			//not using hide() as that makes the size unavailable for subsequent runs (i.e. resizes)
			$element.wrap(div).css('visibility' , 'hidden');
		}
		
		//if there is a completion function defined then gather
		//the variables that might be useful and call it
		if ($.isFunction(settings.onCropResizeComplete)) {
			var data = {
					currentImageWidth: currentImageWidth,
					currentImageHeight: currentImageHeight,
					fullImageWidth: fullImageWidth,
					fullImageHeight: fullImageHeight,
					cropFromLeft: cropFromLeft,
					cropFromRight: cropFromRight,
					cropFromTop: cropFromTop,
					cropFromBottom: cropFromBottom,
					focusPointX: focusPointX,
					focusPointY: focusPointY,
					posLeft: posLeft,
					posTop: posTop
				};
			settings.onCropResizeComplete.call( $element, data );
		}
	}
	
})( jQuery, window, document );
