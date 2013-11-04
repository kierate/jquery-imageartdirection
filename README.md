Image Art Direction
===================

Image Art Direction is a simple jQuery plugin that enables basic [art][1] [direction][2] on images in a responsive design by defining focus point coordinates.
[1]: http://usecases.responsiveimages.org/
[2]: http://blog.cloudfour.com/a-framework-for-discussing-responsive-images-solutions/

Demo
----

Check out the [basic][3] and [custom][4] examples. The code for them is in the `demo/` folder.
[3]: http://kierate.github.io/jquery-imageartdirection/demo/index.html
[4]: http://kierate.github.io/jquery-imageartdirection/demo/index-custom-debug.html

Basic Setup
-----------

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

Configure the coordinates and (optionally) the crop ratio for each of the images that you want the plugin to look at:

```html
<img src="..." alt=".." class="artdirection"
     data-artdirection-focus-point="484,235" data-artdirection-crop-ratio="25%">
```

The `data-artdirection-focus-point` attribute takes the X and Y coordinates separated by a comma.

The `data-artdirection-crop-ratio` attribute takes a percentage number (this is optional and if the atttibute is ommited then the default crop ratio for the plugin will be used).


Plugin options
--------------

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

License
-------

This plugin is available under [the MIT license][5].
[5]: https://raw.github.com/kierate/jquery-imageartdirection/master/LICENSE
				
