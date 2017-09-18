module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: '*',
                    keepalive: true,
                    debug: true,
                    // onCreateServer: function(server, connect, options) {
                    //     var io = require('socket.io').listen(server);
                    //     io.sockets.on('connection', function(socket) {
                    //     // do something with socket
                    //     });
                    // }
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
};