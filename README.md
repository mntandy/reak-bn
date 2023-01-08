### DroneWatcher

What is this?
-------------
This is my attempt at the pre-assignment for a summer job as software developer trainee at Reaktor in Helinski. Here is a link to the pre-assignment: https://assignments.reaktor.com/birdnest/

My solution is a frontend App written in ReactJS with a backend based on node.js Express webserver. The backend receives and processes the relevant data from the Reaktor-server. The frontend establishes a bidirectional connection with the backend and receives the data after processing. This data is then displayed in the frontend. The frontend also visualises the locations of the "drones".

A live version can be found at https://drwatch.fly.dev/

Notes on the production build
-----------------------------
It is worth noting that if you have recently installed React, then you might need to update to the most recent version of react-scripts (npm install react-scripts and then do some audit --force) to get a high enough version that is compatible with Socket.io.

Notes on testing the code locally
---------------------------------
If you want to run this locally, you might want to add localhost:8080 in the useSocket.js file in the frontend at the appropriate location.

