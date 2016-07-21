'use strict';
var path = require('path');
var cluster = require('cluster');
var jsDAV = require("jsDAV/lib/jsdav");
var jsDAV_FS_Tree = require("jsDAV/lib/DAV/backends/fs/tree");
var jsDAV_Locks_Backend_FS = require("jsDAV/lib/DAV/plugins/locks/fs");
var jsDAV_FS_Directory = require("jsDAV/lib/DAV/backends/fs/directory");

module.exports = function(mikser) {
	if (cluster.isWorker || mikser.config.webdav === false) return;
	let debug = mikser.debug('webdav');
	jsDAV.debugMode = mikser.options.debugInclude.indexOf('webdav') != -1;

	mikser.config.webdav = mikser.config.webdav || [mikser.config.documentsFolder.replace(mikser.options.workingFolder, '')];
	if (typeof mikser.config.webdav == 'string') mikser.config.webdav = [mikser.config.webdav];

	mikser.on('mikser.plugins', () => {
		return mikser.utils.resolvePort(mikser.config.webdavPort || 0, 'webdav').then((port) => {
			let server = jsDAV.createServer({
			    node: mikser.config.webdav.map((webdavFolder) => jsDAV_FS_Directory.new(path.join(mikser.options.workingFolder, webdavFolder))),
			    locksBackend: jsDAV_Locks_Backend_FS.new(path.join(mikser.config.runtimeFolder, 'webdav')),
			    plugins: [require('./help')]
			}, port);
			return {
				server: server
			}
		});
	})

}