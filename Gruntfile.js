module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  	
    pkg: grunt.file.readJSON('package.json'),
    
    // Lint definitions
    jshint: {
            files: ['src/jquery.imageartdirection.js'],
            options: {
                jshintrc: '.jshintrc'
            }
    },

    // Minify definitions
    uglify: {
      options: {
		banner: "/*\n" +
                " * <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                " * <%= pkg.description %>\n" +
                " * <%= pkg.homepage %>\n" +
                " *\n" +
                " * Made by <%= pkg.author %>\n" +
                " * Under <%= pkg.licenses[0].type %> License\n" +
                " */\n"
      },
      build: {
        src: 'src/jquery.imageartdirection.js',
        dest: 'dist/jquery.imageartdirection.min.js'
      }
    }
  });

  // Load the plugin the tasks
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify']);

};