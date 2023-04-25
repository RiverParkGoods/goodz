use testdb;

drop table if exists productStock;

create table productStock
(
	prodSeq char(3),
    prodId char(11),
    prodAmount int(3),
    prodProv char(3),
    prodManu char(9),
    foreign key(prodId) references product(prodId)
) default charset=utf8;

show tables;

alter table productStock add constraint PK_PROD_SEQ primary key(prodSeq);

explain productStock;