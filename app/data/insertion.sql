create schema if not exists fyp;

#customer
create table customer(
username varchar (32) not null primary key,
password varchar (32) not null, #still string now, but once encryption sets in will change to char(xx) where xx is the length of encryption e.g. SHA-1: char(40)
name varchar(100) not null,
age smallint(3) not null,
gender char(1) not null,
profession varchar(100) not null,
facebook varchar(100) not null,
photo varchar(100) not null, # reference to image location
current_points int(10) not null);

#merchant
create table merchant(
username varchar(32) not null primary key,
password varchar(32) not null,
company varchar(100) not null);

#indexing the company column of merchant
ALTER TABLE merchant ADD UNIQUE company_index (company);

#deals
create table deals(
company varchar(100) not null,
dealID smallint(5) not null,
date_initiated date not null,
date_expired date not null,
shares_required smallint(10) not null,
shares_current smallint(10) not null,
position varchar(100) not null, 
views smallint(10) not null,
photo varchar(100) not null,
constraint deals_pk primary key(company, dealID),
constraint deals_fk  foreign key(company) references merchant(company));

ALTER TABLE deals ADD UNIQUE composite_index (company, dealID);

#deals_category
create table deals_category(
company varchar(100) not null,
dealID smallint(5) not null,
category varchar(100) not null,
constraint deals_category_pk primary key(company, dealID, category),
constraint deals_category_fk_1 foreign key(company, dealID) references deals(company, dealID));

#deals_shared
create table deals_shared(
username varchar(32) not null,
company varchar(100) not null,
dealID smallint(5) not null,
constraint deals_shared_pk primary key(username, company, dealID),
constraint deals_shared_fk_1 foreign key(username) references customer(username),
constraint deals_shared_fk_2 foreign key(company, dealID) references deals(company, dealID));

#redemption
create table redemption(
company varchar(100) not null,
dealID smallint(5) not null,
options varchar(100) not null, 
amount smallint(5) not null,
constraint redemption_pk primary key(company, dealID, options),
constraint redemption_fk_1 foreign key(company, dealID) references deals(company, dealID));

#admin
create table admin(
username varchar(32) not null primary key,
password varchar(32) not null, 
name varchar(32) not null);

#transaction
create table transaction(
admin_username varchar(32) not null,
customer_username varchar(32) not null,
company varchar(100) not null,
dealID smallint(5) not null,
constraint transaction_pk primary key(admin_username, customer_username, company, dealID),
constraint transaction_fk_1 foreign key(admin_username) references admin(username),
constraint transaction_fk_2 foreign key(customer_username) references customer(username),
constraint transaction_fk_3 foreign key(company, dealID) references deals(company, dealID));