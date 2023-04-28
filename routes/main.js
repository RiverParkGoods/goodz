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

function template_result(result, res) {
   res.writeHead(200);
   var template = `
    <!doctype html>
    <html>
    <head>
        <title>Result</title>
        <meta charset="utf-8">
        <link type="text/css" rel="stylesheet" href="table.css" />
    </head>
    <body>
    <table border="1" style="margin:auto;">
    <thead>
        <tr><th>prodSeq</th><th>prodId</th><th>prodAmount</th><th>prodProv</th><th>prodManu</th></tr>
    </thead>
    <tbody>
    `;
   for (var i = 0; i < result.length; i++) {
      template += `
    <tr>
        <td>${result[i]['prodSeq']}</td>
        <td>${result[i]['prodId']}</td>
        <td>${result[i]['prodAmount']}</td>
        <td>${result[i]['prodProv']}</td>
        <td>${result[i]['prodManu']}</td>
    </tr>
    `;
   }
   template += `
    </tbody>
    </table>
    </body>
    </html>
    `;
   res.end(template);
}

function template_nodata(res) {
   res.writeHead(200);
   var template = `
    <!doctype html>
    <html>
    <head>
        <title>Result</title>
        <meta charset="utf-8">
        <link type="text/css" rel="stylesheet" href="table.css" />
    </head>
    <body>
        <h3>데이터가 존재하지 않습니다.</h3>
    </body>
    </html>
    `;
   res.end(template);
}

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
// GET 요청에 응답함
app.get('/productStock/list', (req, res) => {
   //productStock테이블의 모든 행을 MySQL데이터베이스에서 조회
   const productStock = mysql_conn.query('select * from productStock;');
   //조회 결과 행이 반환되면,
   if (productStock.length > 0) {
      //JSON 객체를 응답으로 반환한다.
      res.write('{"ok":true, "productStock":' + JSON.stringify(productStock) + '}');
      res.end();
   } else {
      //행이 반환되지 않는다면, ok키가 false로 설정되고 오류에 대한 추가 정보가 포함된다.
      res.send('{"ok":false, "db":"mysql", "service":"productStock/list"}');
      return;
   }
});

//GET요청에 응답하는 search api
app.get('/productStock/search', (req, res) => {
   //prodSeq 쿼리 매개 변수를 추출, 이 값을 사용하여 productStock테이블에서 해당 인덱스 상품을 조회!
   const prodSeq = req.query.prodSeq;
   //proSeq값이 빈 문자열이라면,
   if (prodSeq == '') {
      //상품 INDEX를 입력하라는 알림창 출력
      res.write("<script>alert('상품 INDEX를 입력하세요.')</script>");
      //그렇지 않으면
   } else {
      //proSeq값으로 productStock테이블에서 상품을 조회한다.
      const productStock = mysql_conn.query('select * from productStock where prodSeq=?', [prodSeq]);
      //만약 반환된 행 수가 0이면,
      if (productStock.length == 0) {
         //ok키가 false
         res.end('{"ok":false, "service":"search"}');
      } else {
         //반환된 행 수가 0보다 크다면 데이터를 JSON 문자열로 반환하여 응답.
         res.end(JSON.stringify(productStock));
      }
   }
});

// app.get('/productStock/search', (req, res) => {
//    const prodSeq = req.query.prodSeq;
//    if (prodSeq == '') {
//       // res.send('User-id를 입력하세요.')
//       res.write("<script>alert('상품 INDEX를 입력하세요.')</script>");
//    } else {
//       const result = mysql_conn.query('select * from productStock where prodSeq=?', [prodSeq]);
//       console.log(result);
//       // res.send(result);
//       if (result.length == 0) {
//          template_nodata(res);
//       } else {
//          template_result(result, res);
//       }
//    }
// });

//POST 요청에 응답하는 insert
app.post('/productStock/insert', (req, res) => {
   //prodSeq, prodId, prodAmount, prodProv, prodManu라는 필드를 가진 요청 본문에서 값을 추출. 이 값들은 productStock테이블에 새 상품을 추가하는데 사용
   const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
   // 이 값들 중 하나라도 빈 문자열이면, 모든 상품의 정보를 입력하라고 알림
   if (prodSeq == '' || prodId == '' || prodAmount == '' || prodProv == '' || prodManu == '') {
      res.write("<script>alert('모든 상품 정보를 입력해주세요.');</script>");
   } else {
      //그렇지 않으면, 테이블에 상품 정보를 추가. 추가된 행 수를 반환
      const productStock = mysql_conn.query('insert into productStock values(?,?,?,?,?);', [
         prodSeq,
         prodId,
         prodAmount,
         prodProv,
         prodManu,
      ]);
      //반환된 행 수가 1이면
      if (productStock.affectedRows == 1) {
         //상품이 추가되었음을 나타내는 ok:true 반환
         res.send('{"ok":true, "db":"mysql", "service":"productStock/insert"}');
      } else {
         //그렇지 않으면 오류
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
   // 상품인덱스, 상품번호, 상품수량, 상품원산지, 상품제조사 정보를 request.body에서 추출
   const { prodSeq, prodId, prodAmount, prodProv, prodManu } = req.body;
   console.log(prodSeq, prodId, prodAmount, prodProv, prodManu);
   // 수정할 값에 대해 공백으로 입력하면 원본을 유지, 입력해준 값들만 새롭게 변경할 예정이라,
   // 기본적으로 공통적인 query를 변수로 지정.
   let query = 'update productStock set ';
   // query에 이어 붙이기 위해 배열로 지정, 추후에 join을 통해 ','로 이어 붙일 예정
   let q_arr = [];
   // conn.query의 두번째 파라미터로 ?에 해당하는 변수들을 배열로 지정.
   let q_var = [];
   //요청 본문이 있는지 여부를 확인하기 위해 if문 사용. 해당 필드가 있다면 해당 구문을 q_arr배열에 추가. 해당 필드 값을 q_var배열에 추가.
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
      //마지막으로, 상품 시퀀스 번호를  q_var 배열에 추가하고 q_arr 배열을 쉼표로 결합하여 최종 쿼리 문자열을 작성.
      query += q_arr.join(',');
      query += 'where prodSeq=?';
      console.log(query);
      console.log(q_var);
      // res.write('<script>confirm("상품을 수정할까요?");</script>');
      // 쿼리 실행하고 쿼리가 성공적인지 여부를 나타내는 응답을 보낸다.
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

//상품 재고 정보 삭제
app.post('/productStock/delete', (req, res) => {
   //요청 본문에서 상품인덱스 추출
   const prodSeq = req.body.prodSeq;
   if (prodSeq) {
      // res.write('<script>confirm("상품 정보를 삭제할까요?");</script>');
      // 상품인덱스가 요청 본문에 있는지 여부 확인.
      const result = mysql_conn.query('delete from productStock where prodSeq=?', [prodSeq]);
      // res.write('<script>window.location="/product/list"</script>');
      //해당 필드가 있다면
      if (result.affectedRows == 1) {
         // 해당 상품 삭제
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
//내가 로컬 찬우님이 remote
//주소를 찬우님꺼로 설정하고 /product/list를 호출하면 서버에서 해당 URL로 GET 요청을 보내고, 결과를 JSON 형식으로 반환한다.
let baseurl = 'http://192.168.1.15:8000';
app.get('/product/list', function (req, res) {
   request(baseurl + '/product/list', { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/list"}');
      else res.send(CircularJSON.stringify(body));
   });
});

app.get('/product/search', function (req, res) {
   // req.query를 사용해 쿼리 파라미터 keyword, searchway 추출
   const { keyword, searchway } = req.query;
   //baseurl과 keyword, searchway를 조합하여 검색 결과를 요청할 URL 만들기. encodeURI() 함수를 사용해 검색어 keyword를 URL에 포함될 수 있는 형태로 만들기.
   let fullurl = baseurl + '/product/search?keyword=' + encodeURI(keyword) + '&searchway=' + searchway;
   //request로 검색 결과를 요청하고 res.send로 검색 결과를 반환한다.
   request(fullurl, { json: true }, (err, result, body) => {
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/search"}');
      else res.send(CircularJSON.stringify(body));
   });
});

//상품 추가
app.post('/product/insert', function (req, res) {
   const { prodId, prodName, prodPrice, prodArti } = req.body;
   //옵션을 설정하고 요청을 보낸다. 이를 통해 서버에 보낼 HTTP 메소드, 요청 url, 헤더, 바디 등의 정보를 전달한다.
   let options = {
      uri: 'http://192.168.1.15:8000/product/insert',
      method: 'POST',
      header: {
         'Content-Type': 'application/json',
         'Content-Length': 4,
      },
      form: { prodId: prodId, prodName: prodName, prodPrice: prodPrice, prodArti: prodArti },
   };
   //상품 정보는 요청바디(form)에 JSON 형태로 담겨져 전달.
   request.post(options, (error, response, body) => {
      res.send(body);
   });
});

//상품정보 수정
app.post('/product/update', function (req, res) {
   //데이터는 req.body에 담겨 있고 prodId, prodName, prodPrice, prodArti를 각각 변수에 할당
   const { prodId, prodName, prodPrice, prodArti } = req.body;
   //options객체에 API서버의 url과 데이터를 담기
   let options = {
      uri: 'http://192.168.1.15:8000/product/update',
      method: 'POST',
      header: {
         'Content-Type': 'application/json',
         'Content-Length': 4,
      },
      form: { prodId: prodId, prodName: prodName, prodPrice: prodPrice, prodArti: prodArti },
   };
   // request.post로 호출. 해당 url에 post 요청을 전송하고 응답으로 받은 결과를 표시.
   request.post(options, (error, response, body) => {
      res.send(body);
   });
});

//상품 삭제
app.post('/product/delete', function (req, res) {
   //prodId 값 받아오기
   const { prodId } = req.body;
   //options 객체는 요청에 필요한 다양한 옵션을 설정하는데 사용.
   let options = {
      //요청을 보낼 url
      uri: 'http://192.168.1.15:8000/product/delete',
      ///HTTP 요청 메소드
      method: 'POST',
      //요청 헤더
      header: {
         'Content-Type': 'application/json',
         'Content-Length': 4,
      },
      //요청 바디 설정
      form: { prodId: prodId },
   };
   // 요청을 보내고 응답을 받으면, 응답 바디를 res.send함수를 이용해 반환
   request.post(options, (error, response, body) => {
      res.send(body);
   });
});

//artist로 상품 검색
app.get('/product/artist', function (req, res) {
   //name이라는 쿼리 파라미터를 이용
   const name = req.query.name;
   //요청 주소를 지정하고 요청 결과를 JSON 형태로 받음.
   request(baseurl + '/product/artist?name=' + encodeURI(name), { json: true }, (err, result, body) => {
      //에러가 발생하면 ok:false
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/artist"}');
      else res.send(CircularJSON.stringify(body));
   });
});

// prodId로 상품 찾기
//HTTP GET 요청을 보내면, 서버는 상품 ID를 파라미터로 받아 해당 ID에 맞는 상품 정보를 데이터베이스에서 조회
app.get('/product/find', function (req, res) {
   const prodId = req.query.prodId;
   request(baseurl + '/product/find?prodId=' + prodId, { json: true }, (err, result, body) => {
      //조회한 결과를 JSON형태로 받고, 상품 정보 조회에 실패하면 오류 메시지로 응답.
      if (err) res.send('{"ok":false, "db":"mysql", "service":"product/find"}');
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
