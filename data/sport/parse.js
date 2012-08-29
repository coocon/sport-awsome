
var getObj = require('../get.js');
var fs = require('fs');
var path = 'htmls/sport_' + getObj.getNow() + '.html';
var jsdom = require('jsdom');
var jqPath = '../jquery-1.7.2.min.js';
var jquery = fs.readFileSync(jqPath).toString();
var mongoose = require('mongoose');


var databaseUrl = 'mongodb://127.0.0.1/sports',
Schema = mongoose.Schema,
collections = ['england'];

//连接数据库testdb并设置将要被查询的表为isbn，它可以是一个集合
var db = mongoose.connect(databaseUrl);


var trim = function(str) {
   return str.replace(/(^\s*)|(\s*$)/g, "");  
    
    
}
var createSchema =  function(_mongoose) {
    var mongoose = _mongoose || mongoose,
        Schema = mongoose.Schema; 
    var medalSchema = new Schema({
        id:{type:Number, index:true},
        rank:{type:Number},
        gold:{type:Number},
        silver:{type:Number},
        bronze:{type:Number},
        country:{type:String},
        date:{type:Date, default:new Date()}
    }); 
   var model_name = coll_name = 'england';
   mongoose.model(model_name, medalSchema );

   var _schema  = db.model(model_name);
   console.log('_schema:', _schema);
   if( !_schema ) {
       mongoose.model(model_name, medalSchema );
       _schema  = db.model(model_name);

   } 

   return _schema;
}
//items into db
var saveItems = function(Model, items ) {
    var _cnt = 0; 
    var saveItem = function( dataItem, item) {
        var myItem = new Model(); 
        for(var name in dataItem) {
            myItem[name] = dataItem[name];     
        }  
        console.log(myItem);
        _cnt += 1;
        myItem.save(function(err) {
            if (err) {
                console.log('save failed');
            }

            console.log('save success');
            if(_cnt >= len) {
                db.connection.close();
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

