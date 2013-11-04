Image Art Direction
===================

Image Art Direction is a simple jQuery plugin that enables basic [art](http://usecases.responsiveimages.org/)  [direction](http://blog.cloudfour.com/a-framework-for-discussing-responsive-images-solutions/) on images in a responsive design by defining focus point coordinates.

Demo
----

Check out the [basic][1] and [custom][2] examples. The code for them is in the `demo/` folder.
[1]: http://kierate.github.io/jquery-imageartdirection/demo/index.html
[2]: http://kierate.github.io/jquery-imageartdirection/demo/index-custom-debug.html

Setup
-----

Include the jQuery and the plugin files in your page:
```html
<script src="jquery.min.js"></script>
<script src="jquery.imageartdirection.js"></script>
<script>
$(window).load(function() {
	$(function() {
		$('img.artdirection').artDirectionCropResize();
	});
});
</script>
```

You can customise the default crop ratio and add a function to run once the plugin has completed e.g.:
```html
<script>
$(window).load(function() {
	$(function() {
		$('img.artdirection').artDirectionCropResize({
			cropRatio: "30%",
			onCropResizeComplete: function ( data ) {
				//var $element = this;
				//data contains basic information about the resize/crop
			}
		});
	});
});
</script>
```


				
