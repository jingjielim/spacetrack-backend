## Getting Started
1. Create a .`env.local` file in the root directory with the following params:
    ```
    SPACETRACK_USERNAME=<YourSpacetrackUsername>
    SPACETRACK_PASSWORD=<YourSpacetrackPassword>
    MONGODB_URI=<YourMongoDbURI>
    ```
    Your MONGODB_URI should look similar to `mongodb://localhost:27017/satellites`
2. Install MongoDB and MongoDB compass
3. Start MongoDB

4. Run the development server:
    ```bash
    npm run dev
    ```

Open http://localhost:3000/api/satellites with your browser to see the requested information.
