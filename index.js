const http = require('http');

let dataStore = [];

// Helper function to get the body data from the request
const getRequestBody = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Convert Buffer to string
    });
    req.on('end', () => {
        callback(body);
    });
};

// Create the server
const server = http.createServer((req, res) => {
    // Set the response headers
    res.setHeader('Content-Type', 'application/json');
    const { method, url } = req;

    // Handle GET /data (fetch all data)
    if (url === '/' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Data fetched successfully', data: dataStore }));
    }
    // Handle POST /data (add new data)
    else if (url === '/post' && method === 'POST') {
        getRequestBody(req, (body) => {
            const parsedData = JSON.parse(body);  
            dataStore.push(parsedData);           
            res.writeHead(201);            
            res.end(JSON.stringify({ message: 'Data added successfully', data: parsedData }));
        });
    }
    
    // Handle PUT /data (update existing data by id)
    else if (url === '/put' && method === 'PUT') {
        getRequestBody(req, (body) => {
            const parsedData = JSON.parse(body);  // Parse the data to update
            const index = dataStore.findIndex(item => item.id === parsedData.id); // Find the item by ID

            if (index !== -1) {
                dataStore[index] = parsedData;    // Update the data
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Data updated successfully', data: parsedData }));
            } else {
                res.writeHead(404);               // Send 404 if the item was not found
                res.end(JSON.stringify({ message: 'Data not found' }));
            }
        });
    }
    
    // Handle DELETE /data (delete existing data by id)
    else if (url === '/delete' && method === 'DELETE') {
        getRequestBody(req, (body) => {
            const parsedData = JSON.parse(body);  // Parse the data to find the ID
            const index = dataStore.findIndex(item => item.id === parsedData.id); // Find the item by ID

            if (index !== -1) {
                dataStore.splice(index, 1);       // Remove the data from the array
                res.writeHead(200);
                res.end(JSON.stringify({ message: 'Data deleted successfully' }));
            } else {
                res.writeHead(404);               // Send 404 if the item was not found
                res.end(JSON.stringify({ message: 'Data not found' }));
            }
        });
    }
    // Handle other routes

       else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

// Start the server on port 3000
const port = 3000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
