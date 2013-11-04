;(function ( $, window, document, undefined ) {

	var settings,
		resizeTimer;

	$.fn.artDirectionCropResize = function ( options ) {
		//add passed in options to the defaults
		settings = $.extend( {}, $.fn.artDirectionCropResize.defaults, options );

		//add a resize event handler
		$(window).on("resize.artdirectioncropresize", $.proxy(handleWindowResize, this));

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
		var $element = $(element),
			//get the basic size details
			fullImageWidth = element.naturalWidth,
			fullImageHeight = element.naturalHeight,
			currentImageWidth = $element.width(),
			currentImageHeight = $element.height(),
			//get the focus point that is set for this image
			focusPointCoordinates = $element.attr("data-artdirection-focus-point").split(","),
			focusPointX = parseInt($.trim(focusPointCoordinates[0]), 10),
			focusPointY = parseInt($.trim(focusPointCoordinates[1]), 10),
			//calculations for resizing and crop
			cropRatio = getElementCropRatio($element),
			resizePercentage = (fullImageWidth - currentImageWidth) / fullImageWidth * 100,
			cropPercentage = resizePercentage * cropRatio,
			focusLeftTotal = focusPointX,
			focusRightTotal = fullImageWidth - focusPointX,
			focusTopTotal = focusPointY,
			focusBottomTotal = fullImageHeight - focusPointY,
			cropFromLeft = (focusLeftTotal * cropPercentage / 100),
			cropFromRight = (focusRightTotal * cropPercentage / 100),
			cropFromTop = (focusTopTotal * cropPercentage / 100),
			cropFromBottom = (focusBottomTotal * cropPercentage / 100),
			bgWidth = (currentImageWidth + cropFromLeft + cropFromRight),
			bgResizePercentage = (fullImageWidth - bgWidth) / fullImageWidth * 100,
			focusPointXResized = Math.round(focusPointX * (100-bgResizePercentage) / 100 - parseInt(cropFromLeft, 10)),
			focusPointYResized = Math.round(focusPointY * (100-bgResizePercentage) / 100 - parseInt(cropFromTop, 10)),
			focusPointXCenterCorrection = parseInt((currentImageWidth/2 - focusPointXResized) * bgResizePercentage / 100, 10),
			focusPointYCenterCorrection = parseInt((currentImageHeight/2 - focusPointYResized) * bgResizePercentage / 100, 10),
			//a few empty declarations
			imageWrapperDiv,
			alreadyWrapped,
			data;

		//if the focus point after resizing is not in the center then bring it closer
		if (currentImageWidth/2 - focusPointXResized !== 0) {
			cropFromLeft -= focusPointXCenterCorrection;
			cropFromRight += focusPointXCenterCorrection;
		}
		if (currentImageHeight/2 - focusPointYResized !== 0) {
			cropFromTop -= focusPointYCenterCorrection;
			cropFromBottom += focusPointYCenterCorrection;
		}

		//make sure we always fill up the space and not crop too much from each side
		if (cropFromLeft < 0) {
			cropFromRight += cropFromLeft;
			cropFromLeft = 0;
		}
		if (cropFromRight < 0) {
			cropFromLeft += cropFromRight;
			cropFromRight = 0;
		}
		if (cropFromTop < 0) {
			cropFromBottom += cropFromTop;
			cropFromTop = 0;
		}
		if (cropFromBottom < 0) {
			cropFromTop += cropFromBottom;
			cropFromBottom = 0;
		}

		//now that everything is calculated put a div around the target image
		alreadyWrapped = $element.parent("div.img-artdirection-wrapper").length === 1;
		if (!alreadyWrapped) {
			//if the img is not wrapped then create div and wrap around
			imageWrapperDiv = $("<div></div>").addClass("img-artdirection-wrapper");
		} else {
			//if the img is already wrapped then just update the css below
			imageWrapperDiv = $element.parent("div.img-artdirection-wrapper");
		}

		//set up the div with a background image.
		//this background is resized but is slightly bigger than the div,
		//so the parts that are overflowing are cropped
		imageWrapperDiv
						.css("width", "100%")
						.css("height", "auto")
						.css("background-repeat", "no-repeat")
						.css("background-image", "url(" + $element.attr("src") + ")")
						.css("background-position", "-" + cropFromLeft + "px -" + cropFromTop + "px")
						.css("background-size", (currentImageWidth + cropFromLeft + cropFromRight) + "px " +
												(currentImageHeight + cropFromTop + cropFromBottom) + "px");

		//wrap the image with a div if not yet done (first run)
		if (!alreadyWrapped) {
			//not using hide() as that makes the size unavailable for subsequent runs (i.e. resizes)
			$element.wrap(imageWrapperDiv).css("visibility" , "hidden");
		}

		//if there is a completion function defined then gather
		//the variables that might be useful and call it
		if ($.isFunction(settings.onCropResizeComplete)) {
			data = {
					currentImageWidth: currentImageWidth,
					currentImageHeight: currentImageHeight,
					fullImageWidth: fullImageWidth,
					fullImageHeight: fullImageHeight,
					cropFromLeft: cropFromLeft,
					cropFromRight: cropFromRight,
					cropFromTop: cropFromTop,
					cropFromBottom: cropFromBottom,
					focusPointX: focusPointX,
					focusPointY: focusPointY
				};
			settings.onCropResizeComplete.call( $element, data );
		}
	}

	//get the crop ratio for the current image
	function getElementCropRatio(element)
	{
		var cropRatio = settings.cropRatio;

		if (element.attr("data-artdirection-crop-ratio")) {
			cropRatio = $.trim(element.attr("data-artdirection-crop-ratio"));
		}
		cropRatio = cropRatio.replace("%", "") / 100;

		//if the global setting or the one for this image was
		//incorrect then assume crop ratio of 50%
		if (isNaN(cropRatio)) {
			return 0.5;
		}

		return cropRatio;
	}

})( jQuery, window, document );
