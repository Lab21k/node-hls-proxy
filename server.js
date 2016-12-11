'use strict';

const http = require('http'),
        https = require('https'),
        replaceStream = require('replacestream');

//Lets define a port we want to listen to
const PORT=5003; 

const reg = /([^:\/\s]+)\/videoplayback\//g;

//We need a function which handles requests and send response
function handleRequest(request, response) {
    https.get('https://manifest.googlevideo.com/api/manifest/hls_playlist/id/m_Lnj37X6_Y.1/itag/95/source/yt_live_broadcast/requiressl/yes/ratebypass/yes/live/1/cmbypass/yes/goi/160/sgoap/gir%3Dyes%3Bitag%3D140/sgovp/gir%3Dyes%3Bitag%3D136/hls_chunk_host/r4---sn-oxunxg8pjvn-bpbs.googlevideo.com/playlist_type/DVR/gcr/br/mm/32/mn/sn-oxunxg8pjvn-bpbs/ms/lv/mv/m/pl/20/dover/6/upn/ToG5sSchoHQ/mt/1481491882/ip/177.142.51.241/ipbits/0/expire/1481513509/sparams/ip,ipbits,expire,id,itag,source,requiressl,ratebypass,live,cmbypass,goi,sgoap,sgovp,hls_chunk_host,playlist_type,gcr,mm,mn,ms,mv,pl/signature/831742FD85AF189866E5FD2A2DB0CEB99083EE51.300C2DB3AC47B3B8EEC4FEB65E7205D2F1324CA5/key/dg_yt0/playlist/index.m3u8', function(res) {

        res.pipe(replaceStream(reg, '104.131.51.31/'))
            .pipe(response);
    });
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
