/*globals module*/
module.exports = function(grunt) {
	"use strict";
	// Project configuration.
//	var sources = "src/**/*.js";
	var ui5Resources = "src/resources/ui5-*";
	var ui5Version = typeof grunt.option("ui5") === "string" ? grunt.option("ui5") : "ui5";


	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		eslint: {
			files: [
				"gruntfile.js"
				, "src/Component.js"
				, "src/Router.js"
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
					"src/css/esconderse.css": "src/less/esconderse.less"
				}
			}
		},
		compress: {
			ui5: {
				options: {
					archive: "src/resources/deploy/" + ui5Version + ".zip"
				},
				files: [{
					expand: true,
					cwd: "src/resources/" + ui5Version,
					src: ["**"],
					dest: "",
					filter: "isFile"
				}]
			}
		},
		"ftp-deploy": {
			app: {
				auth: {
					host: "cfenner.de",
					port: 21,
					authKey: "allInkl"
				},
				src: "src",
				dest: "esconderse.de/ui5/",
				exclusions: [
					ui5Resources
					, "src/**/.DS_Store"
					, "src/**/Thumbs.db"
					, "src/**/.theming"
					, "src/less"
				]
			},
			ui5: {
				auth: {
					host: "cfenner.de",
					port: 21,
					authKey: "allInkl"
				},
				src: "src/resources/" + ui5Version,
				dest: "esconderse.de/ui5/resources/" + ui5Version,
				exclusions: [
					"src/**/.DS_Store"
					, "src/**/Thumbs.db"
					, "src/**/.theming"
				]
			},
			ui5zip: {
				auth: {
					host: "cfenner.de",
					port: 21,
					authKey: "allInkl"
				},
				src: "src/resources/deploy",
				dest: "esconderse.de/ui5/resources/",
				exclusions: []
			}
		},
		clean: {
			ui5: ["src/resources/" + ui5Version + ".zip", "src/resources/deploy"]
		}
	});

	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-lesslint");
	grunt.loadNpmTasks("grunt-jsonlint");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-coveralls");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-ftp-deploy");
	grunt.loadNpmTasks("grunt-contrib-clean");

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
		"test"
		, "ftp-deploy:app"
	]);

	grunt.registerTask("deploy-ui5", [
		"compress:ui5"
		, "ftp-deploy:ui5zip"
		, "clean:ui5"
	]);
};
/*
// grunt.loadNpmTasks("grunt-contrib-connect");
*/
