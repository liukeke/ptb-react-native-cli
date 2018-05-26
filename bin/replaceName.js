/*
* Batch modify folder files containing specified characters.
*
* */

var fs = require("fs");
var path = require("path");
var log = require('tracer').colorConsole();

var arguments = process.argv.splice(2);
var oldName = arguments[0];
var newName = arguments[1];
var root = path.join(arguments[2]);

/*Modify the content of the file */
function editFile(path) {
    fs.readFile(path, 'utf-8', function (err, data) {
        if (err) {
            log.error("Read file error:" + err);
        } else {
            if (data.indexOf(oldName)) {
                var re = new RegExp(oldName, "g");
                if (data.indexOf(oldName) !== -1) {
                    fs.writeFile(path, data.replace(re, newName), function (err) {
                        if (err) {
                            log.error('Modify file failure' + err);
                        } else {
                            log.info('Modify file success' + path);
                        }
                    });
                }
            }
        }
    });
}

/*Modify the folder name or file name*/
function changeName(path, ele, isDirectory) {
    var re = new RegExp(oldName, "g");
    var oldPath = path + "/" + ele;
    var newPath = path + "/" + ele.replace(re, newName);
    //修改文件名称
    fs.rename(oldPath, newPath, function (err) {
        if (!err) {
            log.info(oldPath + ' replace ' + newPath);
            if (isDirectory) {
                readDir(newPath);
            } else {
                editFile(newPath);
            }
        } else {
            log.error(err)
        }
    })
}

/*Traversing all folder files*/
function readDir(path) {
    fs.readdir(path, function (err, menu) {
        if (!menu)
            return;
        menu.forEach(function (ele) {
            fs.stat(path + "/" + ele, function (err, info) {
                if (err) {
                    log.error(err)
                } else {
                    if (info.isDirectory()) {
                        if (ele.indexOf('node_modules') === -1) {
                            changeName(path, ele, true);
                        }
                    } else {
                        log.info("file: " + ele);
                        changeName(path, ele);
                    }
                }
            })
        })
    })
}

readDir(path.join(root));

