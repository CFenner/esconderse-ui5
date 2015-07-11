module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    	eslint: {
    	    target: ['src/*.js']
    	},
    	lesslint: {
		    development: ["src/less/*.less"],
		    options: {
		    	imports: ['src/less/**/*.less'],
		    	less: { paths: ['includes'] },
				csslint: {
      				'important': false
      			}
		    }
		},
    	jsonlint: {
			all: {
				src: [
					"src/**/*.json",
					"*.json",
					"model/*.json"
				]
			}
		},
		less: {
  			development: {
    			options: {
      				paths: ["src/less/"]
    			},
    			files: {
    				"src/css/esconderse-gen.css": "src/less/esconderse.less"
    			}
    		}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-lesslint');
	grunt.loadNpmTasks('grunt-jsonlint');
	
	// Default task(s).
	grunt.registerTask('validate', [
		"jsonlint", 
		"lesslint"
		//"eslint"
	]);
	
	grunt.registerTask('test', [
		"validate", 
		"less"
	]);
	
	
};
/*
	grunt.registerTask('eslint', ['eslint']);
	grunt.registerTask('lesslint', ['lesslint']);
//	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-less');


*/