const axios = require('axios');
const redis = require("redis");

const auth = require('../../auth/auth_helper');
const errorResponse = require('./error_response');
const constants = require('../../config');


// set the marvel endpoint url
const marvelEndpointUrl = `${constants.MARVEL_ENDPOINT}/${constants.MARVEL_API_VERSION}/${constants.MARVEL_API_RESOURCE_NAME}`;

// instantiate redis
const client = redis.createClient();

client.on("error", function(error) {
  console.error(error);
});

class MarvelCharacters{

    static async listCharacters(req, res) {
        const limit = req.query.limit || 100;
        // append the resource path
        const getCharacterUrl = `${marvelEndpointUrl}/characters`;
        // get the authenticated url with the api keys, timestamp and hash value
        const authUrl = auth.getAuthenicatedUrl(getCharacterUrl);

        // append the limit to fetched to this url
        const url = `${authUrl}&limit=${limit}`;
        
        // using the cache aside strategy
        try {
            // check if data is available in the cache
            client.get(limit.toString(), async (err, reply) => {
                if (reply != null) {
                    let cachedData = JSON.parse(reply);
                    const totalCharacters = cachedData.total;
                    const characterIds = cachedData.data;

                    // fetch only 1 data but compate the total if there is a new character
                    axios.get(`${authUrl}&limit=1`).then((resp) => {
                        if (resp.data.data.total != totalCharacters) {
                            // flush db bc there is a new character added by Marvel
                            client.flushdb();
                        }
                    });
                    // send response from the cache
                    res.status(200).send(characterIds);
                } else {
                    try {
                        let resp = await axios.get(url);
                        if (resp.status == 200) {
                            // get the total number of characters
                            const totalCharacters = resp.data.data.total;
                            // get the array of character objects
                            let characters = resp.data.data.results;
                            let characterIds = [];
                            

                            //extract the character id
                            characters.forEach(character => {
                                characterIds.push(character.id);
                            });
                            // set data in the cache
                            client.set(limit.toString(), JSON.stringify({
                                total: totalCharacters,
                                data: characterIds
                            }));
                            res.status(200).send(characterIds);
                        } else {
                            res.status(resp.status).send(resp.data);
                        }
                    } catch (error) {
                        let err = new errorResponse(error);
                        err.sendErrorResponse(req, res);
                    }
                }
            });
            
            
        } catch (error) {
            
        }

        
    }
    
    /** api for getting the marvel character by id */
    static async getCharacter(req, res) {
        // get the param
        const characterId = req.params.characterId;

        // append the resource path
        const getCharacterUrl = `${marvelEndpointUrl}/characters/${characterId}`;

        // append the apikey, hash value and timestamp for authentication
        const authUrl = auth.getAuthenicatedUrl(getCharacterUrl);

        try {
            let resp = await axios.get(authUrl);
            if (resp.status == 200) {
                // get character data
                let character = resp.data.data.results[0];
                res.status(200).send({
                    id: character.id,
                    name: character.name,
                    description: character.description
                });
            } else {
                res.status(resp.status).send(resp.data);
            }
        } catch (error) {
            let err = new errorResponse(error);
            err.sendErrorResponse(req, res);
        }
    }

}

module.exports = MarvelCharacters;