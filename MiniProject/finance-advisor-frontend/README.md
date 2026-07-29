# AI Finance Advisor Frontend

This is the frontend implementation for the AI Finance Advisor application. It provides a sleek, modern, and highly aesthetic interface for users to manage their finances and interact with an AI advisor.

## Features

- **Modern UI**: Dark mode, glassmorphism, smooth animations, and responsive design.
- **Landing Page**: Highlights features and provides entry points.
- **Authentication**: Login and Sign-up screens.
- **Dashboard**: Overview of balance, spending trends, goals, and recent transactions.
- **AI Chat Interface**: Interactive chat to simulate financial advising from an AI model.
- **Alerts**: Notification system for spending warnings and milestones.

## Technologies Used

- Vanilla HTML5
- CSS3 (Variables, Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)

## Project Structure

```text
finance-advisor-frontend/
├── index.html                # Landing page
├── login.html                # Login page
├── signup.html               # Signup page
├── dashboard.html            # User dashboard
├── ai-chat.html              # AI chat interface
├── alerts.html               # Alerts & notifications
├── css/                      # CSS styles
├── js/                       # JavaScript logic
├── assets/                   # Images, icons, fonts
├── components/               # Reusable HTML snippets (navbar, footer, etc.)
└── config/                   # Global configuration
```

## How to Run

Because this project is built with Vanilla HTML/CSS/JS and uses `fetch` to dynamically load components (like the navbar and sidebar), it needs to be served via a local web server (to avoid CORS issues with the `file://` protocol).

### Option 1: Live Server (VS Code Extension)
1. Open this folder in VS Code.
2. Install the "Live Server" extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.

### Option 2: Python HTTP Server
If you have Python installed, you can run a simple server from your terminal:
```bash
# In the finance-advisor-frontend directory run:
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 3: Node.js (http-server)
If you have Node.js installed:
```bash
npx http-server
```
Then open the provided localhost URL in your browser.

## Next Steps

- Integrate with the backend REST API by updating `js/api.js`.
- Replace mock data in `dashboard.js`, `chat.js`, and `alerts.js` with real API responses.
- Implement real authentication using JWT tokens.
