const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('sync-mysql');
const app = express();
const env = require('dotenv').config({ path: '.env' });

let mysql_conn = new mysql({
   host: process.env.host,
   user: process.env.user,
   password: process.env.password,
   database: process.env.database,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/error', (req, res) => {
   res.redirect('error.html');
});

app.get('/greeting', (req, res) => {
   res.send('Welcome 😊');
});
function leftPad(value) {
   if (value >= 10) {
      return value;
   }

   return `0${value}`;
}
function toStringByFormatting(source, delimiter = '') {
   const year = source.getFullYear();
   const month = leftPad(source.getMonth() + 1);
   const day = leftPad(source.getDate());
   const hour = leftPad(source.getHours());
   const min = leftPad(source.getMinutes());
   const sec = leftPad(source.getSeconds());
   return [year, month, day, hour, min, sec].join(delimiter);
}

app.get('/product/list', (req, res) => {
   let product = mysql_conn.query('select * from product;');
   if (product.length > 0) res.send('{"ok":true, "product":' + JSON.stringify(product) + '}');
   else res.send('{"ok":false, "db":"mysql", "service":"product/list"}');
   return;
});

app.get('/product/artist', (req, res, next) => {
   const name = req.query.name;
   const product = mysql_conn.query('select * from product where prodArti=?;', [name]);

   if (product.length > 0) res.send('{"ok":true, "product":' + JSON.stringify(product) + '}');
   else res.send('{"ok":false, "db":"mysql", "service":"product/artist"}');
   return;
});

app.get('/product/find', (req, res) => {
   let prodId = req.query.prodId;
   let product = mysql_conn.query('select * from product where prodId=?;', [prodId]);
   if (product.length > 0) res.send('{"ok":true, "product":' + JSON.stringify(product) + '}');
   else res.send('{"ok":false, "db":"mysql", "service":"product/find"}');
   return;
});

app.get('/product/search', (req, res) => {
   // 검색 조건 - 검색할때, 상품ID, 상품이름, 아티스트이름 으로 각각 골라 검색하거나, 모두다 검색하는지 선택해서 searchway 로 넘겨줌.
   const searchway = req.query.searchway;
   // 검색 단어
   const keyword = req.query.keyword;
   // query 검색 후 나오는 결과.
   let product;

   //검색조건은 select-option이라 null인 경우가 없는게 정상이지만, 주소로 그냥 접근하는 경우 비어있을수 있고, 검색단어를 빈상태로 검색을 하는경우에 오류가 발생할테니 사전에 error handling
   if (searchway == '') {
      res.write('<script>alert("검색조건이 올바르지 않습니다.");</script>');
      res.redirect('/product/list');
   } else if (keyword == '') {
      res.write('<script>alert("검색단어가 들어있지 않습니다.");</script>');
      res.redirect('/product/list');
   }

   // 검색 조건에 따라 다른 쿼리를 작성해 select 수행.
   if (searchway == 'prodId') {
      product = mysql_conn.query('select * from product where prodId=?;', [keyword]);
   } else if (searchway == 'prodName') {
      product = mysql_conn.query('select * from product where prodName like ?;', ['%' + keyword + '%']);
   } else if (searchway == 'prodArti') {
      product = mysql_conn.query('select * from product where prodArti like ?;', ['%' + keyword + '%']);
   } else if (searchway == 'any') {
      product = mysql_conn.query('select * from product where prodId=? or prodName like ? or prodArti like ?;', [
         keyword,
         '%' + keyword + '%',
         '%' + keyword + '%',
      ]);
   }
   if (product.length > 0) res.send('{"ok":true, "product":' + JSON.stringify(product) + '}');
   else res.send('{"ok":false, "db":"mysql", "service":"product/search"}');
   return;
});

app.post('/product/insert', (req, res) => {
   // 상품ID, 상품이름, 상품가격, 상품의아티스트 정보를 request.body에서 뽑아냄.
   const { prodId, prodName, prodPrice, prodArti } = req.body;
   // 입력 값들이 들어있지 않은 경우에 대한 error handling
   if (prodId == '' || prodName == '' || prodPrice == '' || prodArti == '') {
      res.write("<script>alert('모든 상품 정보를 입력해주세요.');</script>");
   } else {
      // insert query 작성후 결과를 result로.
      const result = mysql_conn.query('insert into product values(?,?,?,?);', [prodId, prodName, prodPrice, prodArti]);
      //추후에 페이지에 추가된 결과로 보여지게 res.redirect를 활용할 예정
      if (result.affectedRows == 1) res.send('{"ok":true, "db":"mysql", "service":"product/insert"}');
      else res.send('{"ok":false, "db":"mysql", "service":"product/insert"}');
   }
   return;
});

app.post('/product/update', (req, res) => {
   // 상품ID, 상품이름, 상품가격, 상품의아티스트 정보를 request.body에서 뽑아냄.
   const { prodId, prodName, prodPrice, prodArti } = req.body;
   // 수정할 값에 대해 공백으로 입력하면 원본을 유지, 입력해준 값들만 새롭게 변경할 예정이라,
   // 기본적으로 공통적인 query를 변수로 지정.
   let query = 'update product set ';
   // query에 이어 붙이기 위해 배열로 지정, 추후에 join을 통해 ','로 이어 붙일 예정
   let q_arr = [];
   // conn.query의 두번째 파라미터로 ?에 해당하는 변수들을 배열로 지정.
   let q_var = [];

   if (prodName) {
      q_arr.push('prodName=?');
      q_var.push(prodName);
   }
   if (prodPrice) {
      q_arr.push('prodPrice=?');
      q_var.push(prodPrice);
   }
   if (prodArti) {
      q_arr.push('prodArti=?');
      q_var.push(prodArti);
   }
   if (prodId) {
      q_var.push(prodId);

      query += q_arr.join(',');
      query += 'where prodId=?';

      const result = mysql_conn.query(query, q_var);
      if (result.affectedRows == 1) res.send('{"ok":true, "db":"mysql", "service":"product/update"}');
      else res.send('{"ok":false, "db":"mysql", "service":"product/update"}');
   } else res.send('<script>alert("PRODUCT ID를 입력해주세요.");</script>');
   return;
});

app.post('/product/delete', (req, res) => {
   // console.log(req.body);
   const prodId = req.body.prodId;
   if (prodId) {
      // res.write('<script>confirm("상품 정보를 삭제할까요?");</script>');
      const result = mysql_conn.query('delete from product where prodId=?', [prodId]);
      // res.write('<script>window.location="/product/list"</script>');
      if (result.affectedRows == 1) res.send('{"ok":true, "db":"mysql", "service":"product/delete"}');
      else res.send('{"ok":false, "db":"mysql", "service":"product/delete"}');
   } else res.send('<script>alert("Product ID를 입력해주세요.");</script>');
   return;
});

// mongodb
const mongoose = require('mongoose');

let orderSchema = mongoose.Schema(
   {
      orderIdx: String,
      orderNumber: String,
      prodId: String,
      orderAmount: String,
      orderTotPrice: Number,
   },
   {
      versionKey: false,
   },
);

let Order = mongoose.model('orders', orderSchema);
app.get('/order/list', (req, res, next) => {
   Order.find({}, { _id: 0 }).exec((err, order) => {
      if (err) res.send({ ok: false, db: 'mongodb', service: 'order/search' });
      else res.send({ ok: true, order: order });
      return;
   });
   return;
});

app.get('/order/search', (req, res, next) => {
   const searchway = req.query.searchway.toString();
   const keyword = req.query.keyword.toString();
   if (searchway == 'orderIdx') {
      Order.findOne({ orderIdx: keyword }, { _id: 0 }).exec((err, order) => {
         if (err) res.send({ ok: false, db: 'mongodb', service: 'order/search' });
         else res.send({ ok: true, order: order });
         return;
      });
   } else if (searchway == 'orderNumber') {
      Order.find({ orderNumber: keyword }, { _id: 0 }).exec((err, order) => {
         if (err) res.send({ ok: false, db: 'mongodb', service: 'order/search' });
         else res.send({ ok: true, order: order });
         return;
      });
   }
   return;
});

let orderIdx = 1;
app.post('/order/insert', (req, res, next) => {
   let orderNumber = toStringByFormatting(new Date());
   let { prodId, orderAmount, prodPrice } = req.body;
   let orderTotPrice = Number(orderAmount) * Number(prodPrice);
   let order = new Order({
      orderIdx: orderIdx,
      orderNumber: orderNumber,
      prodId: prodId,
      orderAmount: orderAmount,
      orderTotPrice: orderTotPrice,
   });
   orderIdx += 1;
   console.log(order);
   order.save((err, silence) => {
      if (err) res.status(500).send({ ok: false, db: 'mongodb', service: 'order/insert' });
      else res.status(200).send({ ok: true, db: 'mongodb', service: 'order/insert' });
      return;
   });
});

app.post('/order/update', (req, res, next) => {
   let { orderIdx, orderNumber, prodId, orderAmount, orderTotPrice } = req.body;
   Order.findOne({ orderIdx: orderIdx }, (err, order) => {
      order.orderNumber = orderNumber;
      order.prodId = prodId;
      order.orderAmount = orderAmount;
      order.orderTotPrice = orderTotPrice;
      order.save((err, silence) => {
         if (err) res.status(500).send({ ok: false, db: 'mongodb', service: 'order/update' });
         else res.status(200).send({ ok: true, db: 'mongodb', service: 'order/update' });
         return;
      });
   });
});

app.post('/order/delete', (req, res, next) => {
   let orderIdx = req.body.orderIdx;
   Order.findOne({ orderIdx: orderIdx }, (err, order) => {
      order.deleteOne(err => {
         if (err) res.status(500).send({ ok: false, db: 'mongodb', service: 'order/delete' });
         else res.status(200).send({ ok: true, db: 'mongodb', service: 'order/delete' });
         return;
      });
   });
});

app.post('/login', (req, res, next) => {
   let { id, pw } = req.body;
   if (id == 'admin' && pw == '1234') res.redirect('http://192.168.1.58:8000/admin.html');
   else res.redirect('/error');
});

const request = require('request');
const CircularJSON = require('circular-json');

let baseURL = 'http://192.168.1.58:8000';
app.get('/productStock/list', (req, res) => {
   request(baseURL + '/productStock/list', { json: true }, (err, result, productStock) => {
      if (err) res.send(CircularJSON.stringify({ ok: false, db: 'mysql', service: 'productStock/list' }));
      else res.send(CircularJSON.stringify(productStock));
   });
   return;
});

app.get('/productStock/search', (req, res) => {
   const prodSeq = req.query.prodSeq;
   request(baseURL + '/productStock/search?prodSeq=' + prodSeq, { json: true }, (err, result, productStock) => {
      if (err) res.send(CircularJSON.stringify({ ok: false, db: 'mysql', service: 'productStock/search' }));
      else res.send(CircularJSON.stringify({ ok: true, productStock: productStock }));
   });
   return;
});

app.post('/productStock/insert', (req, res) => {
   const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
   let options = {
      uri: 'http://192.168.1.58:8000/productStock/insert',
      method: 'POST',
      header: {
         'Content-Type': 'application/json',
         'Content-Length': 5,
      },
      form: { prodSeq: prodSeq, prodId: prodId, prodAmount: prodAmount, prodProv: prodProv, prodManu: prodManu },
   };
   request.post(options, (error, response, body) => {
      res.send(body);
   });
});

app.post('/productStock/update', (req, res) => {
   const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
   let options = {
      uri: 'http://192.168.1.58:8000/productStock/update',
      method: 'POST',
      header: {
         'Content-Type': 'application/json',
         'Content-Length': 5,
      },
      form: { prodSeq: prodSeq, prodId: prodId, prodAmount: prodAmount, prodProv: prodProv, prodManu: prodManu },
   };
   request.post(options, (error, response, body) => {
      res.send(body);
   });
   return;
});

app.post('/productStock/delete', (req, res) => {
   const { prodSeq } = req.body;
   let options = {
      uri: 'http://192.168.1.58:8000/productStock/delete',
      method: 'POST',
      header: {
         'Content-Type': 'application/json',
         'Content-Length': 5,
      },
      form: { prodSeq: prodSeq },
   };

   request.post(options, (error, response, body) => {
      res.send(body);
   });
   return;
});

module.exports = app;
