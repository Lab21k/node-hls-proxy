'use strict';

const http = require('http'),
        https = require('https'),
        replaceStream = require('replacestream'),
	request = require('request');

//Lets define a port we want to listen to
const PORT=5003; 

const reg = /([^:\/\s]+)\/videoplayback\//g;

// /videoplayback/id/m_Lnj37X6_Y.1/itag/95/source/yt_live_broadcast/sq/988/file/seg.ts?requiressl=yes&ratebypass=yes&cmbypass=yes&goi=160&sgoap=gir=yes;itag=140&sgovp=gir=yes;itag=136&hls_chunk_host=r4---sn-oxunxg8pjvn-bpbs.googlevideo.com&playlist_type=DVR&gcr=br&mm=32&mn=sn-oxunxg8pjvn-bpbs&ms=lv&mv=m&pl=20&upn=ToG5sSchoHQ&mt=1481491882&ip=177.142.51.241&ipbits=0&expire=1481513509&sparams=ip,ipbits,expire,id,itag,source,requiressl,ratebypass,live,cmbypass,goi,sgoap,sgovp,hls_chunk_host,playlist_type,gcr,mm,mn,ms,mv,pl&signature=831742FD85AF189866E5FD2A2DB0CEB99083EE51.300C2DB3AC47B3B8EEC4FEB65E7205D2F1324CA5&key=dg_yt0&playlist=index.m3u8&live=1&goap=clen=80184;lmt=1481493895354563&govp=clen=388300;lmt=1481493895354006&dur=5.000

//We need a function which handles requests and send response
function handleRequest(req, response) {
	if (req.url.indexOf('teste') > -1) {
	    https.get('https://manifest.googlevideo.com/api/manifest/hls_playlist/id/m_Lnj37X6_Y.1/itag/95/source/yt_live_broadcast/requiressl/yes/ratebypass/yes/live/1/cmbypass/yes/goi/160/sgoap/gir%3Dyes%3Bitag%3D140/sgovp/gir%3Dyes%3Bitag%3D136/hls_chunk_host/r4---sn-oxunxg8pjvn-bpbs.googlevideo.com/playlist_type/DVR/gcr/br/mm/32/mn/sn-oxunxg8pjvn-bpbs/ms/lv/mv/m/pl/20/dover/6/upn/ToG5sSchoHQ/mt/1481491882/ip/177.142.51.241/ipbits/0/expire/1481513509/sparams/ip,ipbits,expire,id,itag,source,requiressl,ratebypass,live,cmbypass,goi,sgoap,sgovp,hls_chunk_host,playlist_type,gcr,mm,mn,ms,mv,pl/signature/831742FD85AF189866E5FD2A2DB0CEB99083EE51.300C2DB3AC47B3B8EEC4FEB65E7205D2F1324CA5/key/dg_yt0/playlist/index.m3u8', function(res) {

		res.pipe(replaceStream(reg, '104.131.51.31/videoplayback?'))
		    .pipe(replaceStream('https', 'http'))
		    .pipe(response);
	    });
	} else {


		let url = 'https://r4---sn-oxunxg8pjvn-bpbs.googlevideo.com' + req.url;

		url = url.replace('id\/', 'id=');
		url = url.replace('\/itag\/', '&itag=');
		url = url.replace('\/source\/', '&source=');
		url = url.replace('\/sq\/', '&sq=');
		url = url.replace('\/file\/', '&file=');

		console.log(url);

		request({
		    url: url,
		    headers: {
			'Host':'r4---sn-oxunxg8pjvn-bpbs.googlevideo.com',
			'Origin':'https://www.youtube.com',
			'Referer':'https://www.youtube.com/',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
		    }
		}).pipe(response);
	}
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
