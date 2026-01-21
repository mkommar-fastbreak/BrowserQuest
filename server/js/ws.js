
var cls = require("./lib/class"),
    http = require('http'),
    WebSocket = require('ws'),
    Utils = require('./utils'),
    _ = require('underscore'),
    WS = {};

module.exports = WS;

// Global log variable (will be set by main.js)
var log = console;

/**
 * Abstract Server and Connection classes
 */
var Server = cls.Class.extend({
    init: function(port) {
        this.port = port;
    },
    
    onConnect: function(callback) {
        this.connection_callback = callback;
    },
    
    onError: function(callback) {
        this.error_callback = callback;
    },
    
    broadcast: function(message) {
        throw "Not implemented";
    },
    
    forEachConnection: function(callback) {
        _.each(this._connections, callback);
    },
    
    addConnection: function(connection) {
        this._connections[connection.id] = connection;
    },
    
    removeConnection: function(id) {
        delete this._connections[id];
    },
    
    getConnection: function(id) {
        return this._connections[id];
    }
});


var Connection = cls.Class.extend({
    init: function(id, ws, server) {
        this._ws = ws;
        this._server = server;
        this.id = id;
        this.remoteAddress = ws._socket ? ws._socket.remoteAddress : 'unknown';
    },
    
    onClose: function(callback) {
        this.close_callback = callback;
    },
    
    listen: function(callback) {
        this.listen_callback = callback;
    },
    
    send: function(message) {
        var data = JSON.stringify(message);
        this.sendUTF8(data);
    },
    
    sendUTF8: function(data) {
        if (this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(data);
        }
    },
    
    close: function(logError) {
        if (logError) {
            log.info("Closing connection to " + this.remoteAddress + ". Error: " + logError);
        }
        if (this._ws.readyState === WebSocket.OPEN || this._ws.readyState === WebSocket.CONNECTING) {
            this._ws.close();
        }
    }
});


/**
 * Modern WebSocket Server using ws library
 * Supports standard WebSocket protocol (RFC 6455)
 */
WS.MultiVersionWebsocketServer = Server.extend({
    _connections: {},
    _counter: 0,
    
    init: function(port) {
        var self = this;
        
        this._super(port);
        
        // Create HTTP server for status endpoint
        this._httpServer = http.createServer(function(request, response) {
            var url = require('url');
            var path = url.parse(request.url).pathname;
            
            if (path === '/status') {
                if (self.status_callback) {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write(self.status_callback());
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write('[]');
                }
            } else {
                response.writeHead(404);
            }
            response.end();
        });
        
        // Create WebSocket server
        this._wss = new WebSocket.Server({ 
            server: this._httpServer,
            perMessageDeflate: false // Disable compression for compatibility
        });
        
        // Handle WebSocket connections
        this._wss.on('connection', function(ws, request) {
            var connection = new WS.WebSocketConnection(self._createId(), ws, self);
            
            // Set up message handler
            ws.on('message', function(data) {
                if (connection.listen_callback) {
                    try {
                        var message = JSON.parse(data.toString());
                        connection.listen_callback(message);
                    } catch(e) {
                        if (e instanceof SyntaxError) {
                            connection.close("Received message was not valid JSON.");
                        } else {
                            log.error("Error processing message: " + e);
                            throw e;
                        }
                    }
                }
            });
            
            // Set up close handler
            ws.on('close', function() {
                if (connection.close_callback) {
                    connection.close_callback();
                }
                self.removeConnection(connection.id);
            });
            
            // Set up error handler
            ws.on('error', function(error) {
                if (self.error_callback) {
                    self.error_callback(error);
                } else {
                    log.error("WebSocket error: " + error);
                }
            });
            
            // Add connection and notify
            self.addConnection(connection);
            if (self.connection_callback) {
                self.connection_callback(connection);
            }
        });
        
        // Handle HTTP server errors
        this._httpServer.on('error', function(error) {
            if (self.error_callback) {
                self.error_callback(error);
            } else {
                log.error("HTTP server error: " + error);
            }
        });
        
        // Start listening
        this._httpServer.listen(port, function() {
            log.info("Server is listening on port " + port);
        });
    },
    
    _createId: function() {
        return '5' + Utils.random(99) + '' + (this._counter++);
    },
    
    broadcast: function(message) {
        this.forEachConnection(function(connection) {
            connection.send(message);
        });
    },
    
    onRequestStatus: function(status_callback) {
        this.status_callback = status_callback;
    }
});


/**
 * Connection class for modern WebSocket (ws library)
 */
WS.WebSocketConnection = Connection.extend({
    init: function(id, ws, server) {
        this._super(id, ws, server);
    }
});

// Export log setter for main.js
WS.setLog = function(logInstance) {
    log = logInstance;
};
