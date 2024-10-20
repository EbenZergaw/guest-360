# Guest 360 #

A CRM for hotels to manage the preferences of their guests at scale.

### How the Architecture Works

Frontend (NextJS): Deployed on Vercel, front end app will interact with the Django myapi via HTTP requests (API calls). The React app will send requests to our Django API's public endpoint.

myapi (Django): Django will be deployed (on Heroku probably), and will interact with Firebase to handle the data. Django will expose RESTful API endpoints for our NextJS app.

Database: SQL

### Example Flow:

- **React on Vercel** sends a GET or POST request to **Django API** (hosted on Heroku).
- **Django myapi** handles the request, processes any business logic, and interacts with **SQL** to either retrieve or store data.
- **Django** sends the response back to **React**.
