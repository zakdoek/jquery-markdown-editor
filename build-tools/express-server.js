#! /usr/bin/env node

var fs = require( "fs" );
var fsExtra = require( "fs-extra" );
var express = require( "express" );
var serveIndex = require( "serve-index" );
var serveStatic = require( "serve-static" );
var multer = require( "multer" );
var upload = multer({ dest: ".uploads/" });
var app = express();

// Clear uploads dir
fsExtra.emptyDirSync( ".uploads" );

app.post( "/upload", upload.single( "image" ), function( req, res, next ) {
    //       6. Store to desired name

    if ( req.file.mimetype !== "image/jpeg" ) {
        fs.unlinkSync( req.file.path );
        res.send( "Only jpeg images supported!" );
        return;
    }

    var basename;

    if ( "name" in req.body ) {
        basename = req.body.name;
    } else {
        basename = req.file.originalname;
    }

    var name = basename;
    var count = 0;
    while( true ) {
        try {
            fs.statSync( ".uploads/" + name );
        } catch ( err ) {
            break;
        }
        count++;
        name = basename + "-" + count;
    }

    fs.renameSync( req.file.path, ".uploads/" + name );

    res.send( "\n\n\tFile uploaded as " + name + "\n\n" );
});

// Make upload folder browsable
app.use( "/upload", serveIndex( ".uploads" ) );
app.use( "/upload", serveStatic( ".uploads", { index: false } ) );

app.use( serveIndex( "dist", { icons: true } ) );
app.use( serveStatic( "dist", { index: false } ) );
app.use( serveStatic( "node_modules", { index: false } ) );

var server = app.listen( 8000, function () {
    console.log( "Example app listening" );
});
