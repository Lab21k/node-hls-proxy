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

var m3u8url = 'https://manifest.googlevideo.com/api/manifest/hls_playlist/id/hh8Mofex_6o.0/itag/95/source/yt_live_broadcast/requiressl/yes/ratebypass/yes/live/1/cmbypass/yes/goi/160/sgoap/gir%3Dyes%3Bitag%3D140/sgovp/gir%3Dyes%3Bitag%3D136/hls_chunk_host/r7---sn-oxunxg8pjvn-bpbs.googlevideo.com/gcr/br/playlist_type/LIVE/mm/32/mn/sn-oxunxg8pjvn-bpbs/ms/lv/mv/m/pl/20/dover/6/upn/cpicFFn3QFk/mt/1481498297/ip/177.142.51.241/ipbits/0/expire/1481519954/sparams/ip,ipbits,expire,id,itag,source,requiressl,ratebypass,live,cmbypass,goi,sgoap,sgovp,hls_chunk_host,gcr,playlist_type,mm,mn,ms,mv,pl/signature/9AC479B0630295F692F076D9419B47502EA957BE.3756B12C2BC005CB09D635303ED44EB6F536ACA5/key/dg_yt0/playlist/index.m3u8';
function handleRequest(req, response) {
	if (req.url.indexOf('teste') > -1) {
	    https.get(m3u8url, function(res) {

		res.pipe(replaceStream(reg, '138.197.44.169/videoplayback?'))
		    .pipe(replaceStream('https', 'http'))
		    .pipe(response);
	    });
	} else {
		let hostname = 'r7---sn-oxunxg8pjvn-bpbs.googlevideo.com';

		let url = req.url;
		url = url.replace('id\/', 'id=');
		url = url.replace('\/itag\/', '&itag=');
		url = url.replace('\/source\/', '&source=');
		url = url.replace('\/sq\/', '&sq=');
		url = url.replace('\/file\/', '&file=');

		console.log('https://' + hostname + url);

		//console.log(url);

/*
		var _request = request({
		    url: url,
		    headers: {
			'Host':'r4---sn-oxunxg8pjvn-bpbs.googlevideo.com',
			'Origin':'https://www.youtube.com',
			'Referer':'https://www.youtube.com/',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
		    }
		}, function(err, r, body) {
			console.log(r.headers);
			let headers = r.headers;
			delete headers['access-control-allow-origin'];
			response.writeHead(200, headers);
			
			response.end(body);
		});
*/

		 let _req = https.request({
			hostname: hostname,
			path: url,
			port: 443,
			method: 'GET',
			headers:  {
				'Host':'r4---sn-oxunxg8pjvn-bpbs.googlevideo.com',
				'Origin':'https://www.youtube.com',
				'Referer':'https://www.youtube.com/',
				'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36',
				'accept': '*/*'
			}
		    }, ha => {
			ha.on('data', data => {
				console.log('NEW DATA', data);
			});
		    });
		_req.end();


	}
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});
