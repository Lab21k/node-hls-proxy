'use strict';

const http = require('http'),
    https = require('https'),
    replaceStream = require('replacestream'),
    request = require('request'),
    youtubedl = require('youtube-dl');

//Lets define a port we want to listen to
const PORT = process.env.PORT,
        HOST = process.env.HOST,
        VIDEO_URL = process.env.VIDEO_URL;

const videoRegex = /([^:\/\s]+)\/videoplayback\//g;

let handlers = {};
let hostname = '';

youtubedl(VIDEO_URL, [
    '-f 95',
    '-g'
]).on('info', (data) => {
    let videoStreams = data.formats.filter(format => {
        return format.protocol = 'm3u8';
    });

    /* Configure multiple format HLS proxy */
    videoStreams.forEach(stream => {
        handlers[`/${stream.height}`] = (req, res) => {
            res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            https.get(stream.url, (_res) => {
                _res.pipe(replaceStream(videoRegex, 'localhost/videoplayback?'))
                    .pipe(replaceStream('https', 'http'))
                    .pipe(res);
            });
        };
    });

    /* Route for listing all available formats and info */
    handlers['/'] = (req, res) => {
        res.end(JSON.stringify(videoStreams));
    };

    /* Download the first hls stream to capture the fragments host */

    let firstStream = videoStreams[0];
    https.get(firstStream.url, (_res) => {
        let fullUrl = '';

        _res.on('data', (data) => {
            fullUrl += data.toString();
        });

        _res.on('end', () => {
            let hostnames = fullUrl.match(videoRegex);
            if (hostnames.length > 0) {
                hostname = hostnames[0].replace('\/videoplayback\/', '');
                console.log('The server hostname is: ', hostname);
            } else {
                console.log('Could not get the hostname');
            }
        });
    });
});

function requestHandler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url.indexOf('videoplayback') > -1) {

        let url = req.url;
        url = url.replace('id\/', 'id=');
        url = url.replace('\/itag\/', '&itag=');
        url = url.replace('\/source\/', '&source=');
        url = url.replace('\/sq\/', '&sq=');
        url = url.replace('\/file\/', '&file=');

        let _req = https.request({
            hostname: hostname,
            path: url,
            port: 443,
            method: 'GET',
            headers: {
                'Host': hostname,
                'Origin': 'https://www.youtube.com',
                'Referer': 'https://www.youtube.com/',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
                'accept': '*/*'
            }
        }, data => {
            data.pipe(res);
        });

        _req.end();

    } else {
        if (handlers.hasOwnProperty(req.url)) {
            handlers[req.url](req, res);
        } else {
            console.log('Unhandled route ' + req.url);
        }
    }
}


const server = http.createServer(requestHandler);

server.listen(PORT, function() {
    console.log('Server listening on: http://localhost:%s', PORT);
});
