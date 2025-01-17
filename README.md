# AccountaDate

An offline-first dating app focused on respectful connections and accountability.

## Features

- Offline-first architecture using SQLite
- User registration and authentication
- Profile management
- Match system
- Real-time chat
- Respectful conversation ending
- Achievement badges

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web

## Deployment

### Streamlit App
This project includes a Streamlit app that is deployed automatically using GitHub Actions. The app is hosted on Streamlit Cloud and is triggered to deploy on every push to the main branch.

### React Native App
The React Native app is deployed to Expo using GitHub Actions. It builds the app for both Android and iOS when changes are pushed to the main branch. An Expo token is not required for basic functionality when developing with React Native and Expo, but may be needed for certain services or integrations.

### Environment Variables
Make sure to set the following secrets in your GitHub repository:
- `STREAMLIT_APP_KEY`: Your Streamlit Cloud app key.
- `EXPO_TOKEN`: Your Expo token for deployment.

## Tech Stack

- React Native with Expo
- SQLite for local storage
- React Navigation
- Styled Components
- Expo Image Picker
