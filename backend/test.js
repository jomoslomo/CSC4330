const axios = require('axios');

// Set the base URL for your API
const baseURL = 'http://localhost:3001';

// Define a function to log in and obtain a JWT token
async function login(username, password) {
    try {
        const response = await axios.post(
            `${baseURL}/login`,
            {
                username: username,
                password: password
            }
        );
        console.log('Login successful');
        return response.data.token;
    } catch (error) {
        console.error('Failed to log in:', error.response.data);
        return null;
    }
}

// Define a function to create a user build
async function createUserBuild(token) {
    try {
        const response = await axios.post(
            `${baseURL}/user/builds`,
            {
                build_name: 'My New Build2',
                components: ['CPU', 'GPU', 'RAM']
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log('User build created successfully:', response.data);
    } catch (error) {
        console.error('Failed to create user build:', error.response.data);
    }
}

// Define a function to get user builds
async function getUserBuilds(token) {
    try {
        const response = await axios.get(
            `${baseURL}/user/builds`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log('User builds:', response.data);
    } catch (error) {
        console.error('Failed to get user builds:', error.response.data);
    }
}

// Replace 'your_token_here' with a valid JWT token obtained after login
async function main() {
    const token = await login('hello', 'world');
    if (token) {
        // Test the endpoints
        createUserBuild(token);
        getUserBuilds(token);
    } else {
        console.log('Login failed. Exiting.');
    }
}

main();
