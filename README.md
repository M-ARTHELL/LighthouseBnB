# LightBnB
A simple AirBnB clone made during the Lighthouse Labs Web Development Flex program to learn about PostgreSQL and database structure.

## Features
* Ability to create an account.
* Ability to log in and sign out.
* Ability to create a new property.
* Ability to filter search results.

## Initial Setup
* Download the project files.
* Run `npm install` to install project dependencies.
* Start postgres from within the project folder.
* From within the terminal, run the following commands:
  * `CREATE DATABASE lightbnb`
  * `\c lightbnb`
  * `\i migrations/01_schema.sql`
  * `\i seeds/01_seeds.sql`
  * `\i seeds/02_seeds.sql`
* Start the server by using `npm run local` from within the WebApp folder.
* Finally, go to `localhost:3000` from within your browser.

## Images
![The main page showing four listings.](./images/main.png)
![The login page, showing a place to input a username and password.](./images/login.png)
![The "My Reservations" page, showing four reservations made under the user's account.](./images/reservations.png)
![The "Create Listing" page, showing a place to put in a title, description, bedrooms, bathrooms, and parking spaces, the cost per night, urls for thumbnail and cover images, and the address.](./images/create_listing.png)
![The search page, showing city, minimum/maximum costs, and minimum rating options to narrow down the results.](./images/search.png)

## ERD
![An image of the project's ERD. It shows the following: A green rectangle labelled properties containing a primary key of "id", a foreign key of "owner_id", title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, province, city, postal_code. A blue rectangle labelled as "peropty_reviews", containing a primary key of "id", a foreign key of "guest_id", a foreign key of "property_id", a foreign key of "reservation_id", rating, and message. A pink rectangle labelled as "users", containing a primary key of "id", name, email, and password. An orange rectangle labelled as "reservations" containing a primary key "id", a foreign key "property_id", a foreign key "guest_id", start_date, and end_date.](./images/erd.png)

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `database.js` is responsible for all queries to the database.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.