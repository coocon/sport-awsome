//get the get.js engine
var getObj = require('../get.js');

var options = {
    host: 'sports.sina.com.cn',    
    port: 80,
    path:'/global/score/England/',
    filePath:'htmls/sport_' + getObj.getNow() +'.html'
}

getObj.get(options, function() {
    
    console.log('get datas ok', options.filePath);    
});
