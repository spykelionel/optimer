const lh = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const url = require('url');

const customUrl = process.argv.slice(2)[0]
const launchChromeAndLighthouse = site=> {
	return chromeLauncher.launch()
	.then(chrome=>{
		const opts = {
			port: chrome.port
			};
		return lh(site, opts)
			.then(results=>{
				return chrome.kill().then(_=>{
				  return {
      js: results.lhr,
      json: results.report
    };
		});
				
			});
	});
};

const site = process.argv.slice(2)[0]??'https://www.lukeharrison.dev';

launchChromeAndLighthouse(site).then(results=>{
	const urlObj = new URL(site);
let dirName = urlObj.host.replace("www.", "");
if (urlObj.pathname !== "/") {
  dirName = dirName + urlObj.pathname.replace(/\//g, "_");
}
if (!fs.existsSync(dirName)) {
  fs.mkdirSync(dirName);
}
 fs.writeFile(
  `${dirName}/${results.js["fetchTime"].replace(/:/g, "_")}.json`,
  results.json,
  err => {
    if (err) throw err;
  }
);
});

