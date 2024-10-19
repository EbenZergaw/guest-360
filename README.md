# Guest 360 #

A CRM for hotels to manage the preferences of their guests at scale.

### How the Architecture Works

Frontend (NextJS): Deployed on Vercel, front end app will interact with the Flask backend via HTTP requests (API calls). The React app will send requests to our Flask API's public endpoint.

Backend (Flask): Flask will be deployed (on Heroku probably), and will interact with Firebase to handle the data. Flask will expose RESTful API endpoints for our NextJS app.

Firebase: The backend (Flask) communicates with Firebase for authentication, data storage, and potentially other services (like Cloud Functions).

### Example Flow:

- **React on Vercel** sends a GET or POST request to **Django API** (hosted on Heroku).
- **Django backend** handles the request, processes any business logic, and interacts with **Firebase** to either retrieve or store data.
- **Firebase** stores data or handles authentication as needed.
- **Django** sends the response back to **React**.