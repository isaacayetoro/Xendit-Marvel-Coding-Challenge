const express = require('express');
const marvel = require('./controllers/characters');
const auth = require('../auth/authentication');

// instantiate Router class
const router = express.Router();


/**
 * @swagger
 * /characters:
 *  get:
 *      description: Return all the Marvel character ids in a JSON array of numbers
 *      security:
 *        - api_key: []
 *      parameters:
 *        - name: limit
 *          in: query
 *          schema:
 *              type: integer
 *              format: int32
 *      responses:
 *          '200':
 *              description: A list of Marvel characters ids.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: integer
 *                              format: int64
 *          '409':
 *              description: Authentication or bad request error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '401':
 *              description: Invalid Referer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '405':
 *              description: Method not Allowed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '403':
 *              description: Unauthorized access to this endpoint
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '404':
 *              description: Not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: Unexpected error
 */
router.get("/characters", auth.authenticatePubKey, marvel.listCharacters);


/**
 * @swagger
 * /characters/{characterId}:
 *  get:
 *      description: Get character information, returning only the id, name and description of the character
 *      security:
 *        - api_key: []
 *      parameters:
 *        - in: path
 *          name: characterId
 *          description: Marvel character id
 *          required: true
 *          schema:
 *              type: integer
 *              format: int64
 *      responses:
 *          '200':
 *              description: Marvel character information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                                  format: int64
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *          '409':
 *              description: Authentication or bad request error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '401':
 *              description: Invalid Referer
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '405':
 *              description: Method not Allowed
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '403':
 *              description: Unauthorized access to this endpoint
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '404':
 *              description: Character not found
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *          '500':
 *              description: Unexpected error
 */
router.get("/characters/:characterId", auth.authenticatePubKey, marvel.getCharacter);


module.exports = router;
