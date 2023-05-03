
# Authentication template using Typescript, Node.js, Express, Passport.js and Sendgrid

This project is an authentication template designed to be used with typescript, Node.js, Express, Passport.js, and Sendgrid. The goal is to provide an easily adaptable template for allowing your users to sign up and log in to your web application. The template offers two authentication methods: using an email and chosen password, or using Google OAuth2.

The API also provides a password reset feature by sending a token via email. Upon sign-up, a verification email is sent using the Sendgrid API. Access to other routes is secured using JSON Web Tokens.

This template has been designed to facilitate the implementation of a robust and secure authentication system for your web application. It can be easily customized and extended to fit your specific needs.

## Installation

### Prerequisites
PostgreSQL database must be installed

.env file must be created with the following variables:

- PGUSER
- PGHOST
- PGPASSWORD
- PGDATABASE
- PGPORT
- JWT_SECRET
- SENDGRID_API_KEY
- SENDGRID_FROM_EMAIL
- GOOGLE_CLIENT_ID
- GOOGLE_SECRET_CODE

### Steps
1- Install PostgreSQL on your machine. You can download the installer from the official PostgreSQL website: https://www.postgresql.org/download/.

2- Create a .env file in the root directory of your project.

3- Open the .env file and add the following variables with their corresponding values:

```
PGUSER=your_postgres_username
PGHOST=your_postgres_host
PGPASSWORD=your_postgres_password
PGDATABASE=your_postgres_database
PGPORT=your_postgres_port
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_sendgrid_from_email
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET_CODE=your_google_secret_code

Replace the values with your own settings.
```

4- Create a Sendgrid API key by following these steps:

- Go to the Sendgrid website and create an account if you haven't already done so.
- Navigate to the API Keys page in your account settings.
- Click on the "Create API Key" button.
- Choose the "Full Access" permission level.
- Click on the "Create & View" button.
- Copy the API key and paste it into the SENDGRID_API_KEY variable in your .env file.
- Create a Google OAuth2 client ID and secret code by following these steps:

5- Go to the Google Cloud Console and create a project if you haven't already done so.
- Navigate to the "Credentials" page in your project settings.
- Click on the "Create credentials" button and choose "OAuth client ID".
- Choose "Web application" as the application type.
- Enter a name for your client ID.
- Add http://localhost:3000/auth/google/callback as an authorized redirect URI.
- Click on the "Create" button.
- Copy the client ID and secret code and paste them into the GOOGLE_CLIENT_ID and GOOGLE_SECRET_CODE variables in your .env file.
- You're all set! Run npm install to install all dependencies and then npm start to start the server.
## Features

- User authentication with email and password, or Google OAuth2
- Password reset with email token
- Email verification on signup using Sendgrid API
- Access to protected routes with JSON Web Token (JWT) authentication
## Improvements

- User authentication with Facebook, Twitter or Github

