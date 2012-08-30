
var getObj = require('../get.js');
var fs = require('fs');
var path = 'htmls/sport_' + getObj.getNow() + '.html';
var jsdom = require('jsdom');
var jqPath = '../jquery-1.7.2.min.js';
var jquery = fs.readFileSync(jqPath).toString();
var mongoose = require('mongoose');


var databaseUrl = 'mongodb://127.0.0.1/sports',
collections = ['england'];

//连接数据库testdb并设置将要被查询的表为isbn，它可以是一个集合
var db = mongoose.connect(databaseUrl);


var trim = function(str) {
   return str.replace(/(^\s*)|(\s*$)/g, "");  
}

var Schema = new mongoose.Schema( {

    id:{type:Number, index:true, unique:true},
    userName: {type:String},
    passWord: {type:String},
    createDate: {type:Date, default: new Date()}

});
//collection name
var model_name = coll_name  = 'england';
//create collections
mongoose.model(model_name, Schema);

//items into db
var saveItems = function(Model, items ) {
    var _cnt = 0; 
    var saveItem = function( dataItem, len) {
        var myItem = new Model(); 
        for(var name in dataItem) {
            myItem[name] = dataItem[name];     
        }  
        console.log(myItem);
        myItem.save(function(err) {
            if (err) {
                console.log('save failed');
            }

            _cnt += 1;
            console.log('save success');
            if(_cnt >= len) {
                db.nnection.close();
            }
        });   
        
    };
    for(var i=0,len = items.length,item;item = items[i];i++) {
       saveItem(item, len); 
    }
}


var getItems = function($, list) {
    var list = $(list).children(),
    obj = {},
    rank, gold, silver, bronze, country;
    try{ 
        obj.rank = list[0].innerHTML;
        obj.gold = list[2].innerHTML;
        obj.silver = list[3].innerHTML;
        obj.bronze = list[4].innerHTML;
        obj.country =trim( $(list[1]).text() )|| 'wahah';
        console.log(obj);
    } catch(ex) {}
    return obj;
 };
 
jsdom.env({
        html: path,
        src: [jquery],
        done: function(errors, window) {
           var $ = window.$;
           var str = '';
           var arr = [];
           $('.mode_col_l tr').each(function(i) {
               if(i <= 0) {
                   arr.push( getItems($, this) );
                   
                }
           });
           var Model = createSchema(mongoose);
           saveItems(Model, arr); 
        }
});

