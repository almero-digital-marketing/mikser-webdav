'use strict';
var jsDAV_ServerPlugin = require("jsDAV/lib/DAV/plugin");
var jsDAV_iFile = require("jsDAV/lib/DAV/interfaces/iFile");
var path = require('path');
var fs = require("fs");

var jsDAV_Help_Plugin = module.exports = jsDAV_ServerPlugin.extend({
    name: "help",
    
    initialize: function(handler) {
        this.handler = handler;
        handler.addEventListener("beforeMethod", this.httpGetInterceptor.bind(this));
    },

    httpGetInterceptor: function(e, method) {
        if (method != "GET") return e.next();
        var self = this;
        var uri = this.handler.getRequestUri();
        this.handler.getNodeForPath(uri, (err, node) => {
			if (err || node.hasFeature(jsDAV_iFile)) return e.next();

			self.handler.httpResponse.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
			fs.readFile(path.join(__dirname, 'help.html'), (err, data) => {
				if (err) return console.log(err);
				self.handler.httpResponse.end(data);
				e.stop();
			});
        });
    },

});
