/*
 * jQuery File Upload Processing Plugin 1.2.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 *//*jslint nomen: true, unparam: true *//*global define, window */(function(e) {
    "use strict";
    typeof define == "function" && define.amd ? define([ "jquery", "./jquery.fileupload" ], e) : e(window.jQuery);
})(function(e) {
    "use strict";
    var t = e.blueimp.fileupload.prototype.options.add;
    e.widget("blueimp.fileupload", e.blueimp.fileupload, {
        options: {
            processQueue: [],
            add: function(n, r) {
                var i = e(this);
                r.process(function() {
                    return i.fileupload("process", r);
                });
                t.call(this, n, r);
            }
        },
        processActions: {},
        _processFile: function(t) {
            var n = this, r = e.Deferred().resolveWith(n, [ t ]), i = r.promise();
            this._trigger("process", null, t);
            e.each(t.processQueue, function(e, t) {
                var r = function(e) {
                    return n.processActions[t.action].call(n, e, t);
                };
                i = i.pipe(r, t.always && r);
            });
            i.done(function() {
                n._trigger("processdone", null, t);
                n._trigger("processalways", null, t);
            }).fail(function() {
                n._trigger("processfail", null, t);
                n._trigger("processalways", null, t);
            });
            return i;
        },
        _transformProcessQueue: function(t) {
            var n = [];
            e.each(t.processQueue, function() {
                var r = {}, i = this.action, s = this.prefix === !0 ? i : this.prefix;
                e.each(this, function(n, i) {
                    e.type(i) === "string" && i.charAt(0) === "@" ? r[n] = t[i.slice(1) || (s ? s + n.charAt(0).toUpperCase() + n.slice(1) : n)] : r[n] = i;
                });
                n.push(r);
            });
            t.processQueue = n;
        },
        processing: function() {
            return this._processing;
        },
        process: function(t) {
            var n = this, r = e.extend({}, this.options, t);
            if (r.processQueue && r.processQueue.length) {
                this._transformProcessQueue(r);
                this._processing === 0 && this._trigger("processstart");
                e.each(t.files, function(t) {
                    var i = t ? e.extend({}, r) : r, s = function() {
                        return n._processFile(i);
                    };
                    i.index = t;
                    n._processing += 1;
                    n._processingQueue = n._processingQueue.pipe(s, s).always(function() {
                        n._processing -= 1;
                        n._processing === 0 && n._trigger("processstop");
                    });
                });
            }
            return this._processingQueue;
        },
        _create: function() {
            this._super();
            this._processing = 0;
            this._processingQueue = e.Deferred().resolveWith(this).promise();
        }
    });
});