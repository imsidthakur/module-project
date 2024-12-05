import fetch from 'node-fetch'

export const handler = async function(event){
  const { date } = event.queryStringParameters;
  const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=0uPEX2m6VLBphzldYevADOf4gXuwRYplbK0t0sw8`;

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",  
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
