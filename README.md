# NodeJS/Express Application <br>
# Topic : BookStore Application <br>

# Tools Required 
Postman <br>
NodeJs <br>

# steps To Run <br>
S1. Extract the Downloaded Zip File / clone the repo <br>
S2. npm i / npm install <br>
S3. npm run dev <br>
S4. Open Postman app and run given routes <br> 

# 1. Auth Routes <br>

# 1.1 SignUp <br>
Method : POST <br>
URL : http://localhost:5000/api/auth/signup <br>
Description: Creates a user and sends OTP to verify email. OTP is generated using the Math method (6 digits). <br>
Required Inputs Example: <br>
{ <br>
  "name": "alok Kumar", <br>
  "email": "alokkumar77954@gmail.com", <br>
  "phone": "77954506661", <br>
  "password": "Root.@123", <br>
  "confirmPassword": "Root.@123", <br>
  "admin": false <br>
} <br><br>

# 1.2 Verify OTP <br>
Method : POST <br>
URL : http://localhost:5000/api/auth/verify-otp <br>
Description: Verifies OTP with a maximum of 5 attempts. If the OTP is not correct within 5 attempts, the user will be deleted from the database. <br>
Required Inputs Example: <br>
{ <br>
  "email": "alokkumar77954@gmail.com", <br>
  "otp": "962420" <br>
} <br><br>

# 1.3 Login <br>
Method: POST <br>
URL: http://localhost:5000/api/auth/login <br>
Description: Logs in the user. Once logged in, a JWT token is generated and stored in cookies, which expire in 1 hour. <br>
Required Inputs Example: <br>
{ <br>
  "email": "alokkumar77954@gmail.com", <br>
  "password": "Root.@123" <br>
} <br><br>

# 2. User Operations <br>

# 2.1 Update User <br>
Method: PUT <br>
URL: http://localhost:5000/api/user/update <br>
Description: Edits the user profile. Only 'name', 'phone', 'address', 'password', and 'confirmPassword' can be updated. <br>
Required Inputs Example: <br>
{ <br>
  "name": "New Name", <br>
  "phone": "1234567890", <br>
  "address": "New Address", <br>
  "password": "NewPassword.@123", <br>
  "confirmPassword": "NewPassword.@123" <br>
} <br><br>

# 2.2 List Users (Admin Only) <br>
Method: GET <br>
URL : http://localhost:5000/api/user/list <br>
Description: Lists all users (Admin-only route). No input required. <br><br>

# 2.3 Delete User <br>
Method: DELETE <br>
URL: http://localhost:5000/api/user/delete <br>
Description: Deletes the currently logged-in user. No input required. <br><br>

# 3. Book Routes <br>

# 3.1 Add a Book <br>
Method: POST <br>
URL: http://localhost:5000/api/books/book <br>
Description: Adds a book using the `bookModel`. The image must be uploaded via 'form-data' and the image size should not exceed 1MB. The image will be resized to 200x300 using the Sharp library. <br>
Required Inputs Example (form-data): <br>
bookName - To Kill a Mockingbird <br>
genre - Fiction <br>
authorName - Harper Lee <br>
ISBN - 9780060935467 <br>
rate - 4.9 <br>
price - 300 <br>
image - postman-cloud:///1ef71ad2-b7b3-4370-834a-9db0f01e9412 <br><br>

# 3.2 List All Books <br>
Method: GET <br>
URL: http://localhost:5000/api/books/books <br>
Description: Lists all books in the library. No input required. <br><br>

# 3.3 Update Book <br>
Method: PUT <br>
URL: http://localhost:5000/api/books/book/:BookId <br>
Description: Updates a book. Only the user who created the book can edit it. <br>
Required Inputs Example: <br>
{ <br>
  "genre": "fiction", <br>
  "authorName": "Harper Lee", <br>
  "bookName": "Rich Dad Poor Dad", <br>
  "ISBN": "284893457637", <br>
  "rate": 3.5, <br>
  "price": 400 <br>
} <br><br>

# 3.4 Delete Book <br>
Method: DELETE <br>
URL: http://localhost:5000/api/books/book/:bookid <br>
Description: Deletes a book. Only the user who created the book can delete it. No input required. <br><br>

# 4. Cart Routes <br>

# 4.1 Add to Cart <br>
Method: POST <br>
URL: http://localhost:5000/api/cart/add <br>
Description: Adds a book to the cart to proceed to order. <br>
Required Inputs Example: <br>
{ <br>
  "bookId": "66ffaec679a6c95123fe6424", <br>
  "quantity": 10 <br>
} <br><br>

# 4.2 List Cart <br>
Method: GET <br>
URL: http://localhost:5000/api/cart/list <br>
Description: Lists all books present in the user's cart. No input required. <br><br>

# 4.3 Remove from Cart <br>
Method: POST <br>
URL: http://localhost:5000/api/cart/remove/:bookid <br>
Description: Removes a book from the cart. <br>
Required Inputs Example: <br>
{ <br>
  "bookId": "66fe87385cb1c926f0b4593a" <br>
} <br><br>

# 5. Orders <br>

# 5.1 Create Order <br>
Method: POST <br>
URL: http://localhost:5000/api/order/createOrder <br>
Description: Creates an order. An address must be provided if not already set. <br>
Required Inputs Example: <br>
{ <br>
  "bookId": "66ffaec679a6c95123fe6424", <br>
  "address": "Kormangala, Bengaluru, 10000001" <br>
} <br><br>

# 5.2 Cancel Order <br>
Method: POST <br>
URL: http://localhost:5000/api/order/cancelOrder <br>
Description: Cancels an order using the provided orderId. <br>
Required Inputs Example: <br>
{ <br>
  "orderId": "66fe78455a04262b0a3ab88e" <br>
} <br><br>

# 5.3 Update Order Details <br>
Method: PUT <br>
URL: http://localhost:5000/api/order/updateOrder <br>
Description: Updates an order. Only the address and quantity can be updated. <br>
Required Inputs Example: <br>
{ <br>
  "orderId": "66ffb01779a6c95123fe643b", <br>
  "address": "New Address Here", <br>
  "quantity": 2 <br>
} <br><br>

# 5.4 List All Orders <br>
Method: GET <br>
URL: http://localhost:5000/api/order/listOrders <br>
Description: Lists all orders. No input required. <br><br>

# 6. Search Bar <br>

# 6.1 Search Books <br>
Method: POST <br>
URL: http://localhost:5000/api/books/search <br>
Description: Searches for books based on author name or book name. Partial matches are allowed. <br>
Required Inputs Example: <br>
{ <br>
  "search": "fiction" <br>
} <br>
