# NodeJS/Express Application 

# Topic: BookStore Application 

## Tools Required 
- Postman 
- NodeJs 

## Steps To Run 
1. Extract the Downloaded Zip File / clone the repo 
2. Run `npm i` / `npm install` 
3. Run `npm run dev` 
4. Open Postman app and run given routes 

## 1. Auth Routes 

### 1.1 SignUp 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/auth/signup`  
- **Description**: Creates a user and sends OTP to verify email. OTP is generated using the Math method (6 digits).  
**Note**: Admin Status cannot be updated once set but can be updated manually.  
**Required Inputs Example**: 
\`\`\`json
{
  "name": "alok Kumar",
  "email": "alokkumar77954@gmail.com",
  "phone": "1234567890",
  "password": "Root.@123",
  "confirmPassword": "Root.@123",
  "admin": false
}
\`\`\` 

### 1.2 Verify OTP 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/auth/verify-otp`  
- **Description**: Verifies OTP with a maximum of 5 attempts. If the OTP is not correct within 5 attempts, the user will be deleted from the database.  
**Required Inputs Example**: 
\`\`\`json
{
  "email": "alokkumar77954@gmail.com",
  "otp": "123456"
}
\`\`\`

### 1.3 Login 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/auth/login`  
- **Description**: Logs in the user. Once logged in, a JWT token is generated and stored in cookies, which expire in 1 hour.  
**Required Inputs Example**: 
\`\`\`json
{
  "email": "alokkumar77954@gmail.com",
  "password": "Root.@123"
}
\`\`\`

## 2. User Operations 

### 2.1 Update User 
- **Method**: PUT  
- **URL**: `http://localhost:5000/api/user/update`  
- **Description**: Edits the user profile. Only 'name', 'phone', 'address', 'password', and 'confirmPassword' can be updated.  
**Required Inputs Example**: 
\`\`\`json
{
  "name": "New Name",
  "phone": "1234567890",
  "address": "New Address",
  "password": "NewPassword.@123",
  "confirmPassword": "NewPassword.@123"
}
\`\`\`

### 2.2 List Users (Admin Only) 
- **Method**: GET  
- **URL**: `http://localhost:5000/api/user/list`  
- **Description**: Lists all users (Admin-only route). No input required. 

### 2.3 Delete User 
- **Method**: DELETE  
- **URL**: `http://localhost:5000/api/user/delete`  
- **Description**: Deletes the currently logged-in user. No input required. 

## 3. Book Routes 

### 3.1 Add a Book 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/books/book`  
- **Description**: Adds a book using the `bookModel`. The image must be uploaded via 'form-data' and the image size should not exceed 1MB. The image will be resized to 200x300 using the Sharp library.  
**Required Inputs Example (form-data)**: 
- `bookName`: To Kill a Mockingbird 
- `genre`: Fiction 
- `authorName`: Harper Lee 
- `ISBN`: 9780060935467 
- `rate`: 4.9 
- `price`: 300 
- `image`: postman-cloud:///1ef71ad2-b7b3-4370-834a-9db0f01e9412 

### 3.2 List All Books 
- **Method**: GET  
- **URL**: `http://localhost:5000/api/books/books`  
- **Description**: Lists all books in the library. No input required. 

### 3.3 Update Book 
- **Method**: PUT  
- **URL**: `http://localhost:5000/api/books/book/:BookId`  
- **Description**: Updates a book. Only the user who created the book can edit it.  
**Required Inputs Example**: 
\`\`\`json
{
  "genre": "fiction",
  "authorName": "Harper Lee",
  "bookName": "Rich Dad Poor Dad",
  "ISBN": "284893457637",
  "rate": 3.5,
  "price": 400
}
\`\`\`

### 3.4 Delete Book 
- **Method**: DELETE  
- **URL**: `http://localhost:5000/api/books/book/:bookid`  
- **Description**: Deletes a book. Only the user who created the book can delete it. No input required. 

### 3.5 Add Multiple Books
- **Method**: POST  
- **URL**: `http://localhost:5000/api/books/book/many`  
- **Description**: This endpoint allows admins to add multiple books at once using the `bookModel`. Currently, images are not supported for this operation.  
- **Admin Only**: This endpoint is restricted to admin users.  
- **Required Inputs**: You must send a request body containing an array of books. Each book should include the following fields: `bookName`, `genre`, `authorName`, `ISBN`, `rate`, and `price`.  

**Example Request Body**: 
\`\`\`json
{
  "books": [
    {
      "bookName": "The Great Gatsby",
      "genre": "Fiction",
      "authorName": "F. Scott Fitzgerald",
      "ISBN": "9780743273565",
      "rate": 4.5,
      "price": 10.99
    },
    {
      "bookName": "To Kill a Mockingbird",
      "genre": "Fiction",
      "authorName": "Harper Lee",
      "ISBN": "9780060935467",
      "rate": 4.9,
      "price": 12.49
    }
  ]
}
\`\`\`

## 4. Cart Routes 

### 4.1 Add to Cart 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/cart/add`  
- **Description**: Adds a book to the cart to proceed to order.  
**Required Inputs Example**: 
\`\`\`json
{
  "bookId": "66ffaec679a6c95123fe6424",
  "quantity": 10
}
\`\`\`

### 4.2 List Cart 
- **Method**: GET  
- **URL**: `http://localhost:5000/api/cart/list`  
- **Description**: Lists all books present in the user's cart. No input required. 

### 4.3 Remove from Cart 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/cart/remove/:bookid`  
- **Description**: Removes a book from the cart.  
**Required Inputs Example**: 
\`\`\`json
{
  "bookId": "66fe87385cb1c926f0b4593a"
}
\`\`\`

## 5. Orders 

### 5.1 Create Order 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/order/createOrder`  
- **Description**: Creates an order. An address must be provided if not already set.  
**Required Inputs Example**: 
\`\`\`json
{
  "bookId": "66ffaec679a6c95123fe6424",
  "address": "Kormangala, Bengaluru, 10000001"
}
\`\`\`

### 5.2 Cancel Order 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/order/cancelOrder`  
- **Description**: Cancels an order using the provided orderId.  
**Required Inputs Example**: 
\`\`\`json
{
  "orderId": "66fe78455a04262b0a3ab88e"
}
\`\`\`

### 5.3 Update Order Details 
- **Method**: PUT  
- **URL**: `http://localhost:5000/api/order/updateOrder`  
- **Description**: Updates an order. Only the address and quantity can be updated.  
**Required Inputs Example**: 
\`\`\`json
{
  "orderId": "66ffb01779a6c95123fe643b",
  "address": "New Address Here",
  "quantity": 2
}
\`\`\`

### 5.4 List All Orders 
- **Method**: GET  
- **URL**: `http://localhost:5000/api/order/listOrders`  
- **Description**: Lists all orders. No input required. 

## 6. Search Bar 

### 6.1 Search Books 
- **Method**: POST  
- **URL**: `http://localhost:5000/api/books/search`  
- **Description**: Searches for books based on author name or book name. Partial matches are allowed.  
**Required Inputs Example**: 
\`\`\`json
{
  "search": "fiction"
}
\`\`\`
