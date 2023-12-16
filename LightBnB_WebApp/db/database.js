const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function (email) {
  const queryString = 'SELECT * FROM users WHERE email = $1'

  return pool
    .query(queryString, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });

};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = 'SELECT * FROM users WHERE id = $1'

  return pool
    .query(queryString, [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = 'INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING *'
  const val1 = user.name;
  const val2 = user.email;
  const val3 = user.password;

  return pool
    .query(queryString, [val1, val2, val3])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const queryString = `SELECT properties.*, reservations.id, reservations.start_date, AVG(property_reviews.rating) AS "average_rating"
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON property_reviews.reservation_id = reservations.id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.title, properties.cost_per_night, reservations.start_date, properties.id
  ORDER BY reservations.start_date
  LIMIT $2`

  return pool
    .query(queryString, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function (options, limit = 10) {
  let queryString = `SELECT properties.*, AVG(property_reviews.rating) AS "average_rating"
  FROM properties
  JOIN property_reviews ON properties.id = property_id `
  const queryParams = [];

  if (options.city) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.city}`);
    queryString += `city LIKE initcap($${queryParams.length})`;
  }

  if (options.owner_id) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.owner_id}`);
    queryString += `owner_id LIKE initcap($${queryParams.length})`;
  }

  if (options.minimum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.minimum_price_per_night}`);
    queryString += `cost_per_night >= $${queryParams.length}`
  }

  if (options.maximum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += ' AND '
    } else {
      queryString += 'WHERE '
    }
    queryParams.push(`${options.maximum_price_per_night}`);
    queryString += `cost_per_night <= $${queryParams.length}`
  }

  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryString += 'HAVING '
    queryParams.push(`${options.minimum_rating}`);
    queryString += `AVG(property_reviews.rating) >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
