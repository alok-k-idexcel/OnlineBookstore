# ﻿online BookStore express/node application

# required softwares

Postman

Node Js

# how to run ?

extract the zip file / clone the repo

open the file in vscode and open terminal

npm i / npm install

npm run dev

# .env file should contain

MONGO\_URI

EMAIL

EMAIL\_PASSWORD

JWT\_SECRET

# file Structure

/project-root <br>
|-- .env <br>
|-- .gitignore <br>
|-- package.json <br>
|-- app.js <br>
|-- server.js <br>
|-- /config <br>
|   |-- config.js <br>
|-- /controllers <br>
|   |-- authController.js <br>
|   |-- bookController.js <br>
|-- /middleware <br>
|   |-- authMiddleware.js <br>
|-- /models <br>
|   |-- userModel.js <br>
|   |-- bookModel.js <br>
|-- /routes <br>
******|-- authRoutes.js <br>
******|-- bookRoutes.js <br>


# follow the following routes to explore the applications make sure you have postMan downloaded to test the following routes

# Create User

description - Creates a user and sends otp to verify email otp is generated

use Math method of 6 digits

# 1. Auth Routes

# 1. SignUp

Method : Post

URL : http://localhost:5000/api/auth/signup

description : Creates a user to proceed for the login process

verifies the email by sending  random generated OTP using Math function

otp is stored in userModel itself , currently for testing purpose email services

set to secure : false ,Note: if user once set to admin cannot be changed

Required Inputs Example :

{

"name":"alok Kumar",

"email":"alokkumar77954@gmail.com",

"phone":"77954506661",

"password":"Root.@123",

"confirmPassword":"Root.@123",

"admin":false

}


# 1.1 Verify-otp

Method : post

Url : http://localhost:5000/api/auth/verify-otp

Description : verifies Otp for  and has only 5 attempts to confirm

the given otp else the user with be deleted from database

required inputs Example :

{

"email":"alokkumar77954@gmail.com",

"otp":"962420"

}

# 1.2 login

Method: Post

Url: http://localhost:5000/api/auth/login

Description: login route to login user once user is logged in JWT token is created and will expire in 1h

this JWT is stored in cookies format for hassel free experience , which will allow you use all routes

authenticating itself through cookies which is middleware of the route i.e authMiddleware

required inputs example:

{

"email":"alokkumar77954@gmail.com",

"password":"Root.@123"

}

# 2. user Operations

# 2.1 User_Update

method: put

url: http://localhost:5000/api/user/update

description: use to edit the user

required inputs example : "You can only update: name, phone, address, password, confirmPassword"

# 2.2 list users

method: get

url : http://localhost:5000/api/user/list

description: list all the user if you are admin

no required inputs

# 2.3 delete user

method: delete

url: http://localhost:5000/api/user/delete

description: deletes the current logged in user

no required inputs

# 3. bookRoutes

# 3.1 add a book / create a book

method :Post

Url: http://localhost:5000/api/books/book

description : adds a book using bookModel make sure to give the data in form-Data section because of

image upload and max size of image allowed is 1MB and will be resized by itself to 200\*300 using sharp library

required inputs example :

Body                   form-data

bookName -             To Kill a Mockingbird

genre -                Fiction

authorName -           Harper Lee

ISBN -                 9780060935467

rate -                 4.9

price -                300

image -                postman-cloud:///1ef71ad2-b7b3-4370-834a-9db0f01e9412

# 3.2 List all Books

method : get

url: http://localhost:5000/api/books/books

description: lists all the books uploaded in the library by this route

no required inputs

# 3.3 update book

method : put

url : http://localhost:5000/api/books/book/:BookId

description: url should contain book id created by user and only created user can edit book

required inputs example:

{

genre:fiction,

authorName:lee,

bookName:richdad,

ISBN:284893457637,

rate:3.5,

price:400

}

# 3.4 Delete book

method: Delete

url : http://localhost:5000/api/books/book/:bookid

description:url should contain book id created by user and only created user can delete the book

no required inputs

# 4. cartRoutes

# 4.1 add to cart

method : post

url: http://localhost:5000/api/cart/add

description: this url is is used to add book to proceed to the order

required inputs :

{

"bookId":"66ffaec679a6c95123fe6424",

"quantity":10

}

# 4.2 list cart

method : get

url : http://localhost:5000/api/cart/list

description : gives the list of books present in your cart

no  required inputs

# 4.3 remove from cart

method : post

url : http://localhost:5000/api/cart/remove/:bookid

description : removes book from the given id from cart

required inputs example :

{

"bookId":"66fe87385cb1c926f0b4593a"

}

# 5 orders

# 5.1 create order

method : Post

url : http://localhost:5000/api/order/createOrder

description: give address if not given

required inputs :

{

"bookId":"66ffaec679a6c95123fe6424",

"address":"kormangala bengaluru 10000001"

}

# 5.2 cancel order

method : post

url : http://localhost:5000/api/order/cancelOrder

description: cancels the order from orderId given by the User

required inputs example:

{

"orderId":"66fe78455a04262b0a3ab88e"

}

# 5.3 Update the order details

method:put

url : http://localhost:5000/api/order/updateOrder

description: \_id || userId || genre || authorName || bookName || ISBN || rate || image || totalPrice || price

validated order model and route properly user can only update the address and quantity

required inputs ex :

{

"orderId": "66ffb01779a6c95123fe643b",

"address": "New address Here",

"quantity": 2

}

# 5.4 list the orders

method : get

url : http://localhost:5000/api/order/listOrders

description: list the all order

no required inputs

# 6. search Bar

# 6.1 search Bar

method: post

url : http://localhost:5000/api/books/search

description: searches based on author name , book name , even half names are allowed

required inputs example : {

"search":"fiction"

}
