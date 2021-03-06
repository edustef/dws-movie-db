const api = require('./_api');

const handler = async function (event) {
  let showId = event.queryStringParameters.showId;
  try {
    const res = await api.get(`/tv/${showId}`);
    const videos = await api.get(`/tv/${showId}/videos`);
    return {
      statusCode: 200,
      body: JSON.stringify({ ...res.data, trailers: videos.data.results }),
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
