#! /usr/bin/env node

var express = require( "express" );
var serveIndex = require( "serve-index" );
var serveStatic = require( "serve-static" );

var app = express();

app.use( serveIndex( "dist", { icons: true } ) );
app.use( serveStatic( "dist", { index: false } ) );
app.use( serveStatic( "node_modules", { index: false } ) );

var server = app.listen( 8000, function () {
    console.log( "Example app listening" );
});
