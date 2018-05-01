#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const util = require("util");
const argv = require('yargs')
    .option( "l", { alias: "location", demand: true, describe: "Project folder location", type: "string" } )
    .option( "e", { alias: "extension", demand: true, describe: "File extension to include", type: "string" } )
    .argv;

const location = argv.l;
const extension = argv.e.replace('.', '');

var data = {};
var options = {
  pattern: {
    name: 'Java',
    nameMatchers: [extension],
    singleLineComment: [{ start: '//' }],
    multiLineComment: [{ start: '/*', middle: '', end: '*/'}]
  }
}

// Retrieve all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, ext, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', ext, filelist);
      }
      else {
        // push the comment data here
        var filenameArray = file.split('.');
        var extension = filenameArray[filenameArray.length - 1];
        // if it has the given extension, read the comments from it. otherwise do nothing
        if (extension === ext) {
          var content = fs.readFileSync(dir + file, 'utf-8');
          var comments = require('multilang-extract-comments')(content, options);
          filelist.push({ filename: dir + file, comments: comments });
        }
      }
    });
    return filelist;
  };

  console.log(JSON.stringify(walkSync(location, extension)));
  