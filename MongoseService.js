(function() {
	var mongoose = require('mongoose'),
		conn = mongoose.connect('192.168.8.20', 'drugs_20131112'),
		// conn = mongoose.connect('10.6.6.215', 'drugs'),
		Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;
	var drugSchema = new Schema({
		webId:Number,
		type:String,
		pzwh: String,
		ypzwh: String,
		ypbwm: [String],
		ypbwmbz: [String],
		cpmc: String,
		ywmc: String,
		spm: String,
		scdw: String,
		scdz: String,
		gg: [String],
		jx: String,
		cplb: String,
		pzrq: [Date]
	});
	var Drug = mongoose.model('drug', drugSchema, 'drug');
	var dwRe = new RegExp('linkValue=(.*?)\'', 'ig');
	exports.addDrug = function(arr,k) {
		if(!arr || arr.length == 0) {
			return;
		}
		var i, obj = {type:'zh',webId:k};
		for(i = 0; i < arr.length; i++) {
			var k = arr[i][0];
			var v = arr[i][1];
			if(k == '批准文号') {
				obj.pzwh = v;
			} else if(k == '原批准文号') {
				obj.ypzwh = v;
			} else if(k == '药品本位码') {
				obj.ypbwm = v.split('；');
			} else if(k == '药品本位码备注') {
				obj.ypbwmbz = v.split('；');
			} else if(k == '产品名称') {
				obj.cpmc = v;
			} else if(k == '英文名称') {
				obj.ywmc = v;
			} else if(k == '商品名') {
				obj.spm = v;
			} else if(k == '生产单位') {
				var nv = null;
				while((nv = dwRe.exec(v)) != null) {
					obj.scdw = RegExp.$1;
				}
			} else if(k == '生产地址') {
				obj.scdz = v;
			} else if(k == '规格') {
				obj.gg = v.split('；');
			} else if(k == '剂型') {
				obj.jx = v;
			} else if(k == '产品类别') {
				obj.cplb = v;
			} else if(k == '批准日期') {
				obj.pzrq = v.split('；');
			}
		}
		new Drug(obj).save(function(err) {
			if(err) {
				console.log(k + ':' +　err);
			}
		});
	}

}).call(this);