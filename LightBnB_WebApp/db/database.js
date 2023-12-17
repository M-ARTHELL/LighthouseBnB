const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/////////////////////////////////////////////////////
/// USERS
/////////////////////////////////////////////////////

// getUserWithEmail
// gets user with specified email
const getUserWithEmail = function (email) {
  const queryString = 'SELECT * FROM users WHERE email = $1'

  // returns results as promise
  return pool
    .query(queryString, [email])
    .then((result) => {
      return result.rows[0];
    })

    // if error: show in console
    .catch((err) => {
      console.log(err.message);
      return null;
    });

};


// getUserWithId
// gets user with specified id
const getUserWithId = function (id) {
  const queryString = 'SELECT * FROM users WHERE id = $1'

  // returns results as promise
  return pool
    .query(queryString, [id])
    .then((result) => {
      return result.rows[0];
    })

    //if error: show in console
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};


// addUser
// adds a new user to the database
const addUser = function (user) {
  const queryString = 'INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *'
  const val1 = user.name;
  const val2 = user.email;
  const val3 = user.password;

  // return results as promise
  return pool
    .query(queryString, [val1, val2, val3])
    .then((result) => {
      return result.rows[0];
    })

    // if error: show in console
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};


/////////////////////////////////////////////////////
/// RESERVATIONS
/////////////////////////////////////////////////////

// getAllReservations
// gets resevations based on user id.
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `SELECT properties.*, reservations.id, reservations.start_date, AVG(property_reviews.rating) AS "average_rating"
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.reservation_id = reservations.id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.title, properties.cost_per_night, reservations.start_date, properties.id
  ORDER BY reservations.start_date
  LIMIT $2`

  // return results as promise
  return pool
    .query(queryString, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })

    // if error: show in console
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};


/////////////////////////////////////////////////////
/// PROPERTIES
/////////////////////////////////////////////////////

// getAllProperties
// obtains all relevant properties and handles any search options.
const getAllProperties = function (options, limit = 10) {
  let queryString = `SELECT properties.*, AVG(property_reviews.rating) AS "average_rating"
  FROM properties
  JOIN property_reviews ON properties.id = property_id `
  const queryParams = [];

  // the following checks for search options and adds them to the query as needed.
  // city
  if (options.city) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.city}`);
    queryString += `city LIKE initcap($${queryParams.length})`;
  }

  // property owner
  if (options.owner_id) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id = $${queryParams.length}`;
  }

  // min price
  if (options.minimum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `cost_per_night >= $${queryParams.length}`
  }

  // max price
  if (options.maximum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `cost_per_night <= $${queryParams.length}`
  }

  // adds 'GROUP BY' before possible 'HAVING' so the query will function correctly.
  queryString += `GROUP BY properties.id `;

  // avg reviews
  if (options.minimum_rating) {
    queryString += 'HAVING '
    queryParams.push(`${options.minimum_rating}`);
    queryString += `AVG(property_reviews.rating) >= $${queryParams.length}`
  }

  // adds 'ORDER BY' and 'LIMIT' to query.
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`

  // return results as promise
  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows
    })

    // if error: show in console
    .catch((err) => {
      console.log(err.message);
    });
};


// addProperty
// adds a new property to the database using form input
const addProperty = function (property) {

  const queryString = `INSERT INTO properties(owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`

  let queryParams = [];

  queryParams.push(property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms)

  
  // return results as promise
  return pool
    .query(queryString, queryParams)
      .then((result) => {
      return result.rows[0];
    })

    // if error: show in console
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};


module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
