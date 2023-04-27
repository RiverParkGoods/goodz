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

app.get('/greeting', (req, res) => {
   res.send('Welcome 😊');
});

// app.get('/product/list', (req, res) => {
//    let product = mysql_conn.query('select * from product;');
//    if (product.length > 0) {
//       res.write('{"ok":true, "product":' + JSON.stringify(product) + '}');
//       res.end();
//    } else {
//       res.send('{"ok":false, "db":"mysql", "service":"product/list"}');
//       return;
//    }
// });

// app.get('/product/list1', (req, res) => {
//    const result = mysql_conn.query('SELECT * FROM product WHERE prodArti = "WOODZ";');
//    console.log(result.length);
//    res.writeHead(200);
//    let temp = '';
//    for (let i = 0; i < result.length; i++) {
//       temp += `<tr><td>${result[i].prodId}</td><td>${result[i].prodName}</td><td>${result[i].prodPrice}</td><td>${result[i].prodArti}</td><td>${result[i].prodImg}</td></tr>`;
//    }
//    let resultPage = makeResultTemplate(`
//    <table border="1" style="margin: auto; text-align: center">
//       <thead>
//          <tr>
//             <th>PRODUCT ID</th>
//             <th>PRODUCT NAME</th>
//             <th>PRODUCT PRICE</th>
//             <th>PRODUCT ARTIST</th>
//             <th>PRODUCT IMAGE</th>
//          </tr>
//       </thead>
//       <tbody>
//          ${temp}
//       </tbody>
//    </table>`);
//    res.end(resultPage);
// });

// app.get('/product/list2', (req, res) => {
//    const result = mysql_conn.query('SELECT * FROM product WHERE prodArti = "IU";');
//    console.log(result.length);
//    res.writeHead(200);
//    let temp = '';
//    for (let i = 0; i < result.length; i++) {
//       temp += `<tr><td>${result[i].prodId}</td><td>${result[i].prodName}</td><td>${result[i].prodPrice}</td><td>${result[i].prodArti}</td><td>${result[i].prodImg}</td></tr>`;
//    }
//    let resultPage = makeResultTemplate(`
//    <table border="1" style="margin: auto; text-align: center">
//       <thead>
//          <tr>
//             <th>PRODUCT ID</th>
//             <th>PRODUCT NAME</th>
//             <th>PRODUCT PRICE</th>
//             <th>PRODUCT ARTIST</th>
//             <th>PRODUCT IMAGE</th>
//          </tr>
//       </thead>
//       <tbody>
//          ${temp}
//       </tbody>
//    </table>`);
//    res.end(resultPage);
// });

// app.get('/product/search', (req, res) => {
//    // 검색 조건 - 검색할때, 상품ID, 상품이름, 아티스트이름 으로 각각 골라 검색하거나, 모두다 검색하는지 선택해서 searchway 로 넘겨줌.
//    const searchway = req.query.searchway;
//    // 검색 단어
//    const keyword = req.query.keyword;
//    // query 검색 후 나오는 결과.
//    let product;

//    //검색조건은 select-option이라 null인 경우가 없는게 정상이지만, 주소로 그냥 접근하는 경우 비어있을수 있고, 검색단어를 빈상태로 검색을 하는경우에 오류가 발생할테니 사전에 error handling
//    if (searchway == '') {
//       res.write('<script>alert("검색조건이 올바르지 않습니다.");</script>');
//       res.redirect('/product/list');
//    } else if (keyword == '') {
//       res.write('<script>alert("검색단어가 들어있지 않습니다.");</script>');
//       res.redirect('/product/list');
//    }

//    // 검색 조건에 따라 다른 쿼리를 작성해 select 수행.
//    if (searchway == 'prodId') {
//       product = mysql_conn.query('select * from product where prodId=?;', [keyword]);
//    } else if (searchway == 'prodName') {
//       product = mysql_conn.query('select * from product where prodName like ?;', ['%' + keyword + '%']);
//    } else if (searchway == 'prodArti') {
//       product = mysql_conn.query('select * from product where prodArti like ?;', ['%' + keyword + '%']);
//    } else if (searchway == 'any') {
//       product = mysql_conn.query('select * from product where prodId=? or prodName like ? or prodArti like ?;', [
//          keyword,
//          '%' + keyword + '%',
//          '%' + keyword + '%',
//       ]);
//    }
//    //결과로 보여지는 테이블을 담기위해 resultPage 변수 생성
//    let resultPage = ``;
//    if (product.length > 0) {
//       res.write('{"ok":true, "product":' + JSON.stringify(product) + '}');
//       resultPage = listPage(product);
//       res.end(resultPage);
//       return;
//    } else {
//       res.send('{"ok":false, "db":"mysql", "service":"product/list"}');
//       return;
//    }

//    //result가 있는 경우에만 table로 찍고, 없는 경우엔 조회결과가 없음을 띄운다.
//    if (result.length > 0) {
//       res.writeHead(200);
//       // res.end('{"ok":true, "product":' + JSON.stringify(result) + '}');
//       let temp = '';
//       for (let i = 0; i < result.length; i++) {
//          temp += `<tr><td>${result[i].prodId}</td><td>${result[i].prodName}</td><td>${result[i].prodPrice}</td><td>${result[i].prodArti}</td><td>${result[i].prodImg}</td></tr>`;
//       }
//       resultPage = makeResultTemplate(`
//          <table border="1" style="margin: auto; text-align: center">
//             <thead>
//                <tr>
//                   <th>PRODUCT ID</th>
//                   <th>PRODUCT NAME</th>
//                   <th>PRODUCT PRICE</th>
//                   <th>PRODUCT ARTIST</th>
//                   <th>PRODUCT IMAGE</th>
//                </tr>
//             </thead>
//             <tbody>
//                ${temp}
//             </tbody>
//          </table>
//       `);
//       res.end(resultPage);
//    } else {
//       resultPage = makeResultTemplate(`
//             <div class="empty">
//                Can't find Any Data.
//             </div> `);
//       // res.write('<script>alert("조회 결과가 없어요.");</script>');
//       // res.send(
//       //    '{"ok":false, "product":{"prodId":undefined, "prodName":undefined, "prodPrice":undefined,"prodArti":undefined, "prodImg":undefined}}',
//       // );
//       res.end(resultPage);
//    }
// });

// app.post('/product/insert', (req, res) => {
//    // 상품ID, 상품이름, 상품가격, 상품의아티스트 정보를 request.body에서 뽑아냄.
//    const { prodId, prodName, prodPrice, prodArti } = req.body;
//    // 사진 정보를 추가 할 것 이어서, 데이터 확인을 위해서만 default.png로 일괄 지정
//    let prodImg = 'default.png';
//    // 입력 값들이 들어있지 않은 경우에 대한 error handling
//    if (prodId == '' || prodName == '' || prodPrice == '' || prodArti == '') {
//       res.write("<script>alert('모든 상품 정보를 입력해주세요.');</script>");
//    } else {
//       // insert query 작성후 결과를 result로.
//       const result = mysql_conn.query('insert into product values(?,?,?,?,?);', [
//          prodId,
//          prodName,
//          prodPrice,
//          prodArti,
//          prodImg,
//       ]);
//       //추후에 페이지에 추가된 결과로 보여지게 res.redirect를 활용할 예정
//       if (result.affectedRows == 1) {
//          res.send('{"ok":true, "db":"mysql", "service":"product/insert"}');
//       } else {
//          res.send('{"ok":false, "db":"mysql", "service":"product/insert"}');
//       }
//    }
// });

// app.post('/product/update', (req, res) => {
//    // 상품ID, 상품이름, 상품가격, 상품의아티스트 정보를 request.body에서 뽑아냄.
//    const { prodId, prodName, prodPrice, prodArti } = req.body;
//    // 수정할 값에 대해 공백으로 입력하면 원본을 유지, 입력해준 값들만 새롭게 변경할 예정이라,
//    // 기본적으로 공통적인 query를 변수로 지정.
//    let query = 'update product set ';
//    // query에 이어 붙이기 위해 배열로 지정, 추후에 join을 통해 ','로 이어 붙일 예정
//    let q_arr = [];
//    // conn.query의 두번째 파라미터로 ?에 해당하는 변수들을 배열로 지정.
//    let q_var = [];

//    if (prodName) {
//       q_arr.push('prodName=?');
//       q_var.push(prodName);
//    }
//    if (prodPrice) {
//       q_arr.push('prodPrice=?');
//       q_var.push(prodPrice);
//    }
//    if (prodArti) {
//       q_arr.push('prodArti=?');
//       q_var.push(prodArti);
//    }
//    if (prodId) {
//       q_var.push(prodId);

//       query += q_arr.join(',');
//       query += 'where prodId=?';

//       // res.write('<script>confirm("상품을 수정할까요?");</script>');
//       const result = mysql_conn.query(query, q_var);
//       // res.write('<script>window.location="/product/list"</script>');
//       if (result.affectedRows == 1) {
//          res.send('{"ok":true, "db":"mysql", "service":"product/update"}');
//       } else {
//          res.send('{"ok":false, "db":"mysql", "service":"product/update"}');
//       }
//    } else {
//       res.write('<script>alert("PRODUCT ID를 입력해주세요.");</script>');
//    }
// });

// app.post('/product/delete', (req, res) => {
//    const prodId = req.body.prodId;
//    if (prodId) {
//       // res.write('<script>confirm("상품 정보를 삭제할까요?");</script>');
//       const result = mysql_conn.query('delete from product where prodId=?', [prodId]);
//       // res.write('<script>window.location="/product/list"</script>');
//       if (result.affectedRows == 1) {
//          res.send('{"ok":true, "db":"mysql", "service":"product/delete"}');
//       } else {
//          res.send('{"ok":false, "db":"mysql", "service":"product/delete"}');
//       }
//    } else {
//       res.write('<script>alert("Product ID를 입력해주세요.");</script>');
//    }
// });

//yeonji productStock
app.get('/productStock/list', (req, res) => {
   const productStock = mysql_conn.query('select * from productStock;');
   if (productStock.length > 0) {
      res.write('{"ok":true, "productStock":' + JSON.stringify(productStock) + '}');
      res.end();
   } else {
      res.send('{"ok":false, "db":"mysql", "service":"productStock/list"}');
      return;
   }
});

app.get('/productStock/search', (req, res) => {
   const prodSeq = req.query.prodSeq;
   // console.log(req.query);
   if (prodSeq == '') {
      res.write("<script>alert('상품 INDEX를 입력하세요.')</script>");
   } else {
      const productStock = mysql_conn.query('select * from productStock where prodSeq=?', [prodSeq]);
      if (productStock.length == 0) {
         res.end('{"ok":false, "service":"search"}');
      } else {
         res.end(JSON.stringify(productStock));
      }
   }
});

app.post('/productStock/insert', (req, res) => {
   const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
   // console.log(prodSeq, prodId, prodAmount, prodProv, prodManu);
   if (prodSeq == '' || prodId == '' || prodAmount == '' || prodProv == '' || prodManu == '') {
      res.write("<script>alert('모든 상품 정보를 입력해주세요.');</script>");
   } else {
      const productStock = mysql_conn.query('insert into productStock values(?,?,?,?,?);', [
         prodSeq,
         prodId,
         prodAmount,
         prodProv,
         prodManu,
      ]);
      if (productStock.affectedRows == 1) {
         res.send('{"ok":true, "db":"mysql", "service":"productStock/insert"}');
      } else {
         res.send('{"ok":false, "db":"mysql", "service":"productStock/insert"}');
      }
   }
});

// app.post('/productStock/update', (req, res) => {
//    const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
//    if (prodSeq == '' || prodId == '' || prodAmount == '' || prodProv == '' || prodManu == '') {
//       // res.send('User-id와 Password를 입력하세요.');
//       res.write("<script>alert('상품 정보를 입력하세요.')</script>");
//    } else {
//       const result = mysql_conn.query('select * from productStock where prodSeq=?', [prodSeq]);
//       // const result = mysql_conn.query(
//       //    'select * from (select ps.prodSeq, p.prodId, p.prodName, p.prodPrice, p.prodArti, ps.prodAmount from productStock ps, product p where p.prodId = ps.prodId) as stock where prodSeq=?',
//       //    [prodSeq],
//       // );
//       console.log(result);
//       // res.send(result);
//       if (result.length == 0) {
//          template_nodata(res);
//       } else {
//          const result = mysql_conn.query(
//             'update productStock set prodId=?, prodAmount=?, prodProv=?, prodManu=? where prodSeq=?',
//             [prodId, prodAmount, prodProv, prodManu, prodSeq],
//          );
//          console.log(result);
//          res.redirect('/productStock/search?prodSeq=' + prodSeq);
//       }
//    }
// });

app.post('/productStock/update', (req, res) => {
   // 상품인덱스, 상품번호, 상품수량, 상품원산지, 상품제조사 정보를 request.body에서 뽑아냄.

   const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
   console.log(prodSeq, prodId, prodAmount, prodProv, prodManu);
   // 수정할 값에 대해 공백으로 입력하면 원본을 유지, 입력해준 값들만 새롭게 변경할 예정이라,
   // 기본적으로 공통적인 query를 변수로 지정.
   let query = 'update productStock set ';
   // query에 이어 붙이기 위해 배열로 지정, 추후에 join을 통해 ','로 이어 붙일 예정
   let q_arr = [];
   // conn.query의 두번째 파라미터로 ?에 해당하는 변수들을 배열로 지정.
   let q_var = [];

   if (prodId) {
      q_arr.push('prodId=?');
      q_var.push(prodId);
   }
   if (prodAmount) {
      q_arr.push('prodAmount=?');
      q_var.push(prodAmount);
   }
   if (prodProv) {
      q_arr.push('prodProv=?');
      q_var.push(prodProv);
   }
   if (prodManu) {
      q_arr.push('prodManu=?');
      q_var.push(prodManu);
   }
   if (prodSeq) {
      q_var.push(prodSeq);

      query += q_arr.join(',');
      query += 'where prodSeq=?';
      console.log(query);
      console.log(q_var);
      // res.write('<script>confirm("상품을 수정할까요?");</script>');
      const result = mysql_conn.query(query, q_var);
      // res.write('<script>window.location="/product/list"</script>');
      console.log(result);
      if (result.affectedRows == 1) {
         res.send('{"ok":true, "db":"mysql", "service":"productStock/update"}');
      } else {
         res.send('{"ok":false, "db":"mysql", "service":"productStock/update"}');
      }
   } else {
      res.write('<script>alert("PRODUCT INDEX를 입력해주세요.");</script>');
   }
});

app.post('/productStock/delete', (req, res) => {
   const prodSeq = req.body.prodSeq;
   if (prodSeq) {
      // res.write('<script>confirm("상품 정보를 삭제할까요?");</script>');
      const result = mysql_conn.query('delete from productStock where prodSeq=?', [prodSeq]);
      // res.write('<script>window.location="/product/list"</script>');
      if (result.affectedRows == 1) {
         res.send('{"ok":true, "db":"mysql", "service":"productStock/delete"}');
      } else {
         res.send('{"ok":false, "db":"mysql", "service":"productStock/delete"}');
      }
   } else {
      res.write('<script>alert("Product INDEX를 입력해주세요.");</script>');
   }
});

const request = require('request');
const CircularJSON = require('circular-json');

let baseurl = 'http://192.168.1.15:8000';
app.get('/product/list', function (req, res) {
   request(baseurl + '/product/list', { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/list"}');
      else res.send(CircularJSON.stringify(body));
   });
});
app.get('/product/search', function (req, res) {
   const { keyword, searchway } = req.query;
   let fullurl = baseurl + '/product/search?keyword=' + encodeURI(keyword) + '&searchway=' + searchway;
   request(fullurl, { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/search"}');
      else res.send(CircularJSON.stringify(body));
   });
});
app.get('/product/insert', function (req, res) {
   request(baseurl + '/product/insert', { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/insert"}');
      else res.send(CircularJSON.stringify(body));
   });
});
app.get('/product/update', function (req, res) {
   request(baseurl + '/product/update', { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/update"}');
      else res.send(CircularJSON.stringify(body));
   });
});
app.get('/product/delete', function (req, res) {
   request(baseurl + '/product/delete', { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/delete"}');
      else res.send(CircularJSON.stringify(body));
   });
});
app.get('/product/artist', function (req, res) {
   const name = req.query.name;
   request(baseurl + '/product/artist?name=' + encodeURI(name), { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/artist"}');
      else res.send(CircularJSON.stringify(body));
   });
});
// const data = JSON.stringify({ todo: 'Buy the milk - Moon' });
// app.get('/data', function (req, res) {
//    res.send(data);
// });

// option = 'http://192.168.1.15:8000/data';
// app.get('/rdata', function (req, res) {
//    request(option, { json: true }, (err, result, body) => {
//       if (err) {
//          res.send('{"ok":false, "db":"mysql", "service":"productStock/delete"}');
//       }
//       res.send(CircularJSON.stringify(body));
//    });
// });

module.exports = app;
