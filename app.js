var request = require('request');
var htmlparser = require("htmlparser");
var mongoseService = require('./MongoseService');
// request('http://app1.sfda.gov.cn/datasearch/face3/search.jsp?curstart=1&tableId=25', function(error, response, body) {
// 	if(!error && response.statusCode == 200) {
// 		console.log(body);
// 	}
// });

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
	mongoseService.addDrug(values);
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

function load(i) {
	if(i % 100 == 0) {
		console.log(i);
	}
	request('http://app1.sfda.gov.cn/datasearch/face3/content.jsp?tableId=25&tableName=TABLE25&Id=' + i, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			parser.parseComplete(body);
		}
		if(i < 191000) {
			load(i + 1);
		}
	});
}

load(1);