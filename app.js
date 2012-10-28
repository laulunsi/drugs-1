var request = require('request');
var htmlparser = require("htmlparser");
var mongoseService = require('./MongoseService');

function getTrs(dom) {
	var tmp = dom[1].children[3].children[1].children[1].children;
	var trs = new Array();
	for(var i = 0; i < tmp.length; i++) {
		if(tmp[i].type == 'tag' && tmp[i].name == 'tr') {
			trs.push(tmp[i]);
		}
	}
	return trs;
}

function saveValues(trs) {
	var values = new Array();
	for(var i = 0; i < trs.length; i++) {
		var tmp = trs[i].children;
		if(tmp.length < 2) {
			continue;
		}
		var value = new Array();
		for(var j = 0; j < tmp.length; j++) {
			if(tmp[j].type == 'tag' && tmp[j].name == 'td') {
				var children = tmp[j].children;
				if(children && children[0] && children[0].type == 'text') {
					value.push(children[0].data);
				} else {
					if(children && children[0].name == 'a') {
						value.push(children[0].attribs.href);
					}
				}
			}
		}
		if(value.length == 2) {
			values.push(value);
		}
	}
	mongoseService.addDrug(values,k);
}

var handler = new htmlparser.DefaultHandler(function(error, dom) {
	if(error) {
		console.log(error);
	} else {
		saveValues(getTrs(dom));
	}
}, {
	verbose: false,
	ignoreWhitespace: false
});
var parser = new htmlparser.Parser(handler);
var k = 10940;
function load() {
	if(k % 100 == 0) {
		console.log(k);
	}
	request('http://app1.sfda.gov.cn/datasearch/face3/content.jsp?tableId=25&tableName=TABLE25&Id=' + k, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			parser.parseComplete(body);
		}
		if(k < 191000) {
			k = k + 1;
			load();
		}
	});
}

load();