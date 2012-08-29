var http = require('http');
var iconv = require('iconv').Iconv;
var fs = require('fs');
//need to handle from config file
var options = {
    host: 'sports.sina.com.cn',    
    port: 80,
    path:'/global/score/England/',
    filePath:'sina_sport.html'
}

var getNow = function() {
    var d = new Date();
    var strs = [];
    var year = d.getFullYear(),
    month = (d.getMonth()+1) < 10?'0' +(d.getMonth()+1):(d.getMonth()+1),
    day = (d.getDate()) < 10 ? '0' + d.getDate() : d.getDate();

    return [year, month, day].join('');
}
var get = function(options, callback) {
    console.log('start的扒数据');
    http.get(options, function(res){
        console.log(res.statusCode);
        var buffers = [];
        var size = 0;
        console.log('开始');
        res.on('data', function(buffer){
            buffers.push(buffer);
            size+= buffer.length;
            console.log('...............' + size + '.................' );
        });
        res.on('end', function(){
            var buffer = new Buffer(size), pos = 0;     
            for (var i=0;i<buffers.length;i++) {
                buffers[i].copy(buffer, pos);     
                pos += buffers[i].length;
            }
            var gbk_to_utf8 = new iconv('GBK', 'UTF-8//TRANSLIT//IGNORE'); 
            var utf8_buffer = gbk_to_utf8.convert(buffer);
        fs.writeFile(options.filePath, utf8_buffer, function(){});
        //console.log(newBuffer.toString());
        console.log('结束');
        //callback
        if(callback) {
            callback();     
        }

        });
    });
   }

exports.get = get;
exports.getNow = getNow;
