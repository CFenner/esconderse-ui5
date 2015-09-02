/*globals module*/
module.exports = function(grunt) {
	"use strict";
	// Project configuration.
//	var sources = "src/**/*.js";
	var ui5Resources = "src/resources/1.28.5";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		eslint: {
			files: [
				"gruntfile.js"
				, "src/Component.js"
				, "src/view/**/*.js"
				, "src/controller/**/*.js"
				, "src/util/**/*.js"
				, "src/js/**/*.js"
			]
		},
		lesslint: {
			development: ["src/less/*.less"],
			options: {
				imports: ["src/less/**/*.less"],
				less: { paths: ["includes"] },
				csslint: {
					"important": false
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
		},
		"ftp-deploy": {
			build: {
				auth: {
					host: "cfenner.de",
					port: 21,
					authKey: "allInkl"
				},
				src: "src",
				dest: "test-upload/",
				exclusions: [
					"src/**/.DS_Store",
					"src/**/Thumbs.db",
					"src/**/.theming"
					, ui5Resources
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-lesslint");
	grunt.loadNpmTasks("grunt-jsonlint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-coveralls");
	grunt.loadNpmTasks("grunt-ftp-deploy");

	// Default task(s).
	grunt.registerTask("validate", [
		"jsonlint"
		, "lesslint"
		, "eslint"
	]);

	grunt.registerTask("test", [
		"validate"
		, "less"
	]);

	grunt.registerTask("deploy", [
		"validate"
		, "test"
		, "ftp-deploy"
	]);
};
/*
// grunt.loadNpmTasks("grunt-contrib-connect");
*/
