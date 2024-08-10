const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const filePath = path.join(__dirname, 'tokens.json');

// Function to read tokens from the JSON file
function readTokens() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // Return an empty array if the file does not exist
    return [];
  }
}

// Function to write tokens to the JSON file
function writeTokens(tokens) {
  fs.writeFileSync(filePath, JSON.stringify(tokens, null, 2));
}

// Route to add a token using a GET request
fastify.get('/add-token/:token', async (request, reply) => {
  const { token } = request.params;

  // Read the current tokens from the file
  let tokens = readTokens();

  // Check if the token is already in the file
  if (tokens.includes(token)) {
    return reply.code(400).send({ error: 'Token already exists' });
  }

  // Add the token to the array
  tokens.push(token);

  // Write the updated tokens back to the file
  writeTokens(tokens);

  return { message: 'Token added successfully', tokens };
});

// Route to retrieve all tokens from the JSON file
fastify.get('/tokens', async (request, reply) => {
  const tokens = readTokens();
  return { tokens };
});

// Route to retrieve a specific token by its value
fastify.get('/token/:token', async (request, reply) => {
  const tokens = readTokens();
  const { token } = request.params;

  // Check if the token exists in the array
  if (tokens.includes(token)) {
    return { message: 'Token exists', token };
  } else {
    return reply.code(404).send({ error: 'Token not found' });
  }
});

// Route to delete a specific token using a GET request
fastify.get('/delete-token/:token', async (request, reply) => {
  const { token } = request.params;

  // Read the current tokens from the file
  let tokens = readTokens();

  // Find the token in the array
  const index = tokens.indexOf(token);

  // If the token is found, remove it
  if (index !== -1) {
    tokens.splice(index, 1);

    // Write the updated tokens back to the file
    writeTokens(tokens);

    return { message: 'Token removed successfully', tokens };
  } else {
    return reply.code(404).send({ error: 'Token not found' });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    fastify.log.info(Server is running at http://localhost:3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
