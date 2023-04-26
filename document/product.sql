use testdb;

drop table if exists product;

create table product
(
	prodId char(11),
    prodName char(8),
    prodPrice int(7),
    prodArti char(9)
) default charset=utf8;

show tables;

alter table product add constraint PK_PROD_ID primary key(prodId);

explain product;

insert into product values('20230301001','음파반지',45000,'IU');
insert into product values('20230302001','스마트톡',15000,'WOODZ');
insert into product values('20230302002','머그컵',20000,'WOODZ');
insert into product values('20230302003','미니파우치',23000,'WOODZ');
insert into product values('20230302004','버니키링',20000,'WOODZ');
insert into product values('20210502001','인형키링',23000,'WOODZ');
insert into product values('20210502002','생일볼캡',32000,'WOODZ');
insert into product values('20210502003','포토북',24000,'WOODZ');
insert into product values('20210502004','티셔츠',36000,'WOODZ');
insert into product values('20210502005','매일백',34000,'WOODZ');
insert into product values('20210502006','폰케이스',20000,'WOODZ');
insert into product values('20230301002','머그컵',20000,'IU');
insert into product values('20230301003','미니파우치',23000,'IU');
insert into product values('20230301004','스마트톡',15000,'IU');
insert into product values('20230301005','버니키링',20000,'IU');
insert into product values('20220901001','라이트스틱',6000,'IU');
insert into product values('20220901002','후디',69000,'IU');
insert into product values('20220901003','에코백',20000,'IU');
insert into product values('20220901004','포토카드',12000,'IU');
insert into product values('20220901005','시리얼볼',10000,'IU');
insert into product values('20220901006','마그넷',18000,'IU');
insert into product values('20220901007','아크릴키링',15000,'IU');
insert into product values('20220901008','볼캡',25000,'IU');
insert into product values('20220901009','포스터',12000,'IU');
insert into product values('20220901010','미니포토북',12000,'IU');
insert into product values('20220802001','포스터북',15000,'WOODZ');
insert into product values('20220802002','체인팔찌',29000,'WOODZ');
insert into product values('20220802003','스티커팩',9000,'WOODZ');
insert into product values('20220802004','콜렉터북',22000,'WOODZ');
insert into product values('20220802005','포토카드홀더',13000,'WOODZ');
insert into product values('20220802006','폴라로이드',18000,'WOODZ');
insert into product values('20211202001','슬로건',18000,'WOODZ');
insert into product values('20211202002','AR포토카드',25000,'WOODZ');
insert into product values('20211202003','홀로그램티켓',12000,'WOODZ');
insert into product values('20211201001','패브릭포스터',15000,'IU');
insert into product values('20211201002','목걸이',35000,'IU');
insert into product values('20211201003','네일스티커',9000,'IU');
insert into product values('20211201004','무드등',29000,'IU');
insert into product values('20211201005','폴라로이드스티커',14000,'IU');
insert into product values('20210501001','클렌징바',8000,'IU');
insert into product values('20210501002','거울',5000,'IU');
insert into product values('20210501003','스탬프 세트',12000,'IU');
insert into product values('20210501004','다이어리',12000,'IU');
insert into product values('20210501005','브로치',15000,'IU');
insert into product values('20220402001','참 세트',19000,'WOODZ');
insert into product values('20220402002','맨투맨',69000,'WOODZ');
insert into product values('20220402003','가랜드',18000,'WOODZ');
insert into product values('20220402004','아크릴 링',11000,'WOODZ');
insert into product values('20220402005','마스킹테이프',7000,'WOODZ');
insert into product values('20220402006','팝업카드',13000,'WOODZ');
insert into product values('20220402007','뱃지',9000,'WOODZ');
insert into product values('20220402008','쿠션',24000,'WOODZ');
insert into product values('20201201001','스마트톡',9000,'IU');
insert into product values('20201201002','포켓시계',11000,'IU');
insert into product values('20201201003','텀블러 스티커',5000,'IU');
insert into product values('20201201004','텀블러',29000,'IU');
insert into product values('20201201005','마그넷',13000,'IU');
insert into product values('20201201006','포스터',12000,'IU');
insert into product values('20201201007','수면안대',23000,'IU');
insert into product values('20201201008','플리스 자켓',67000,'IU');
insert into product values('20210501006','바인더 앨범',20000,'IU');
insert into product values('20210501007','코인',18000,'IU');
insert into product values('20200401001','L홀더',4900,'IU');
insert into product values('20200401002','노트',10500,'IU');
insert into product values('20200401003','메탈뱃지',10500,'IU');
insert into product values('20200401004','스티키노트',8400,'IU');
insert into product values('20200401005','아크릴키링',10500,'IU');
insert into product values('20200401006','포토바인더',14000,'IU');
insert into product values('20230102001','폰 스트랩',13500,'WOODZ');
insert into product values('20230102002','팔찌',19000,'WOODZ');
insert into product values('20230102003','마스크',25000,'WOODZ');
insert into product values('20230102004','칫솔',5500,'WOODZ');
insert into product values('20230102005','런치박스',26000,'WOODZ');
insert into product values('20230102006','무드등',33000,'WOODZ');
insert into product values('20230102007','담요',28000,'WOODZ');
insert into product values('20200302001','밴드',18000,'WOODZ');
insert into product values('20200302002','ID카드',11000,'WOODZ');
insert into product values('20200302003','홀로그램포토카드',8000,'WOODZ');
insert into product values('20200302004','엽서',4000,'WOODZ');
insert into product values('20230303001','스마트톡',15000,'신세경');
insert into product values('20230303002','머그컵',20000,'신세경');
insert into product values('20230303003','미니파우치',23000,'신세경');
insert into product values('20230303004','버니키링',20000,'신세경');
insert into product values('20230303005','포토북',24000,'신세경');
insert into product values('20220103001','담요',19000,'신세경');
insert into product values('20220103002','밴드',4000,'신세경');
insert into product values('20220103003','마스크',6000,'신세경');
insert into product values('20220103004','엽서',10000,'신세경');
insert into product values('20220103005','대본집',43000,'신세경');
insert into product values('20210403001','에어팟케이스',23000,'신세경');
insert into product values('20210403002','폰케이스',33000,'신세경');
insert into product values('20210403003','포토카드',12000,'신세경');
insert into product values('20210403004','포스터',12000,'신세경');
insert into product values('20210403005','팬미팅 DVD',45000,'신세경');
insert into product values('20210403006','쿠션',24000,'신세경');
insert into product values('20230402001','WOODZ투어',114300,'WOODZ');
insert into product values('20201001029','러브포엠블루레이',58700,'IU');
insert into product values('20201001030','러브포엠DVD',43800,'IU');
insert into product values('20220301839','조각집다큐멘터리',69800,'IU');
insert into product values('20190301003','이지금블루레이',54000,'IU');
select * from product;

