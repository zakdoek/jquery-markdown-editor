#!/usr/bin/env node

var finalhandler = require( "finalhandler" );
var http = require( "http" );
var serveIndex = require( "serve-index" );
var serveStatic = require( "serve-static" );

// Serve directory indexes for ./ folder ( with icons )
var index = serveIndex( "./dist/", { icons: true } );

// Serve up public/ftp folder files
var serveDemo = serveStatic( "./demo/" );
var serveDist = serveStatic( "./dist/" );
var serveNode = serveStatic( "./node_modules/" );

// Create server
var server = http.createServer( function onRequest( req, res ) {
    var done = finalhandler( req, res );
    serveDemo( req, res, function( err ) {

        if ( err ) {
            return done( err );
        }

        serveDist( req, res, function ( err ) {
            if ( err ) {
                return done( err );
            }

            serveNode( req, res, function( err ) {

                if ( err ) {
                    return done( err );
                }

                index( req, res, done );
            });

        });
    });
});

// Listen
server.listen( 8000, function() {
    console.log( "Started listening for requests at port 8000." );
});
