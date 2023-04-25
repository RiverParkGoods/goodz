const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('sync-mysql');
// const mongoClient = require('mongodb').MongoClient;
const env = require('dotenv').config({ path: '../.env' });

function makeResultTemplate(body) {
   let result = `
   <!doctype html>
   <html>
   <head>
      <title>BlockPage</title>
      <meta charset="utf-8">
      <link type="text/css" rel="stylesheet" href="../table.css">
   </head>
   <body>
      ${body}
   </body>
   </html>`;
   return result;
}

let mysql_conn = new mysql({
   host: process.env.host,
   user: process.env.user,
   password: process.env.password,
   database: process.env.database,
});

const state = { db: null };
let dbURL = 'mongodb://192.168.1.15:27017';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/greeting', (req, res) => {
   res.send('Welcome 😊');
});

// app.post('/login', (req, res) => {
//    const { id, pw } = req.body;
//    // const { id:id, pw:pw } = req.body;
//    const result = mysql_conn.query('select * from user where userid=? and passwd=?', [id, pw]);
//    if (result.length == 0) {
//       res.redirect('error.html');
//    }
//    if (id == 'admin' || id == 'root') {
//       console.log(id + ' => Administrator Log-in');
//       res.redirect('admin.html');
//    } else {
//       console.log(id + ' => User Log-in');
//       res.redirect('user.html');
//    }
// });

// app.post('/register', (req, res) => {
//    const { id, pw } = req.body;
//    if (id == '') {
//       res.redirect('register.html');
//    } else {
//       let result = mysql_conn.query('select * from user where userid=?', [id]);
//       if (result.length > 0) {
//          res.writeHead(200);
//          let template = makeResultTemplate(`
//          <div>
//             <h3 style="margin-left: 30px">Registrer Failed</h3>
//             <h4 style="margin-left: 30px">Already Exist ID.</h4>
//             <a href="register.html" style="margin-left: 30px">Try Again</a>
//          </div>`);
//          res.end(template);
//       } else {
//          result = mysql_conn.query('insert into user values (?, ?)', [id, pw]);
//          console.log(result.length);
//          res.redirect('/');
//       }
//    }
// });

app.get('/product/list', (req, res) => {
   const result = mysql_conn.query('select * from product;');
   console.log(result.length);
   res.writeHead(200);
   let temp = '';
   for (let i = 0; i < result.length; i++) {
      temp += `<tr><td>${result[i].prodId}</td><td>${result[i].prodName}</td><td>${result[i].prodPrice}</td><td>${result[i].prodArti}</td></tr>`;
   }
   let resultPage = makeResultTemplate(` 
   <table border="1" style="margin: auto; text-align: center">
      <thead>
         <tr>
            <th>PRODUCT ID</th>
            <th>PRODUCT NAME</th>
            <th>PRODUCT PRICE</th>
            <th>PRODUCT ARTIST</th>
         </tr>
      </thead>
      <tbody>
         ${temp}
      </tbody>
   </table>`);
   res.end(resultPage);
});

app.get('/product/search', (req, res) => {
   console.log(req.query);
   const searchway = req.query.searchway;
   const keyword = req.query.keyword;
   let result;
   console.log(searchway, keyword);

   if (searchway == 'prodId') {
      result = mysql_conn.query('select * from product where prodId=?;', [keyword]);
   } else if (searchway == 'prodName') {
      result = mysql_conn.query('select * from product where prodName like ?;', ['%' + keyword + '%']);
      console.log('여기');
      console.log(result);
   } else if (searchway == 'prodArti') {
      result = mysql_conn.query('select * from product where prodArti like ?;', ['%' + keyword + '%']);
   } else if (searchway == 'any') {
      result = mysql_conn.query('select * from product where prodId=? or prodName like ? or prodArti like ?;', [
         keyword,
         '%' + keyword + '%',
         '%' + keyword + '%',
      ]);
   } else {
      res.redirect('/product/list');
   }
   console.log(result);

   let resultPage = ``;
   if (result.length > 0) {
      let temp = '';
      console.log(result.length);
      res.writeHead(200);
      res.end('{"ok":true, "product":' + JSON.stringify(result) + '}');
      // for (let i = 0; i < result.length; i++) {
      //    temp += `<tr><td>${result[i].prodId}</td><td>${result[i].prodName}</td><td>${result[i].prodPrice}</td><td>${result[i].prodArti}</td></tr>`;
      // }
      // resultPage = makeResultTemplate(`
      //    <table border="1" style="margin: auto; text-align: center">
      //       <thead>
      //          <tr>
      //             <th>PRODUCT ID</th>
      //             <th>PRODUCT NAME</th>
      //             <th>PRODUCT PRICE</th>
      //             <th>PRODUCT ARTIST</th>
      //          </tr>
      //       </thead>
      //       <tbody>
      //          ${temp}
      //       </tbody>
      //    </table>
      // `);
      // res.end(resultPage);
   } else {
      resultPage = makeResultTemplate(`
            <div class="empty">
               Can't find Any Data.
            </div> `);
      // res.write('<script>alert("조회 결과가 없어요.");</script>');
      res.send(
         '{"ok":false, "product":{"prodId":undefined, "prodName":undefined, "prodPrice":undefined,"prodArti":undefined}}',
      );
   }
});

app.post('/product/insert', (req, res) => {
   const { prodId, prodName, prodPrice, prodArti } = req.body;
   if (prodId == '') {
      res.write("<script>alert('Product ID 입력해주세요.');</script>");
   } else {
      // res.write('<script>confirm("상품 정보를 추가할까요?");</script>');
      const result = mysql_conn.query('insert into product values(?,?,?,?);', [prodId, prodName, prodPrice, prodArti]);
      if (result.affectedRows == 1) {
         res.send('{"ok":true, "affectedRows":' + result.affectedRows + ', "service":"insert"}');
      } else {
         res.send('{"ok":false, "affectedRows":' + result.affectedRows + ', "service":"insert"}');
      }
   }
});

app.post('/product/update', (req, res) => {
   const { prodId, prodName, prodPrice, prodArti } = req.body;
   let query = 'update product set ';
   let q_arr = [];
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
      // res.write('<script>confirm("상품을 수정할까요?");</script>');
      const result = mysql_conn.query(query, q_var);
      // res.write('<script>window.location="/product/list"</script>');
      if (result.affectedRows == 1) {
         res.send('{"ok":true, "affectedRows":' + result.affectedRows + ', "service":"update"}');
      } else {
         res.send('{"ok":false, "affectedRows":' + result.affectedRows + ', "service":"update"}');
      }
   } else {
      res.write('<script>alert("PRODUCT ID를 입력해주세요.");</script>');
   }
});

app.post('/product/delete', (req, res) => {
   const prodId = req.body.prodId;
   if (prodId) {
      // res.write('<script>confirm("상품 정보를 삭제할까요?");</script>');
      const result = mysql_conn.query('delete from product where prodId=?', [prodId]);
      // res.write('<script>window.location="/product/list"</script>');
      if (result.affectedRows == 1) {
         res.send('{"ok":true, "affectedRows":' + result.affectedRows + ', "service":"delete"}');
      } else {
         res.send('{"ok":false, "affectedRows":' + result.affectedRows + ', "service":"delete"}');
      }
   } else {
      res.write('<script>alert("Product ID를 입력해주세요.");</script>');
   }
});

app.get('/error', (req, res) => {
   res.redirect('error.html');
});

// app.post('/purchase', (req, res) => {
// mongoClient.connect(dbURL, { useUnifiedTopology: true }, (err, client) => {
//    console.log('START');
//    if (err != null) {
//       res.json({ count: -1 });
//    } else {
//       state.db = client.db('test');
//       state.db
//          .collection('things')
//          .find({})
//          .toArray(function (err, result) {
//             if (err) throw err;
//             console.log('result : ');
//             console.log(result);
//             res.json(JSON.stringify(result));
//          });
//    }
// });
// });

module.exports = app;
