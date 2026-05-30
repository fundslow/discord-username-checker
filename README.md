# Discord Username Checker

A real-time Discord username availability checker built with Node.js and Express.

## Features

✨ **Real-time Checking** - Check Discord usernames in real-time with live feedback  
📊 **Statistics** - Track checked, available, and taken usernames  
🎯 **Filter by Letter** - Start checking from a specific letter  
🎨 **Modern UI** - Beautiful dark theme matching Discord's design  
📱 **Responsive** - Works on desktop and mobile devices  
🔗 **Webhook Support** - Optional Discord webhook integration  
⚡ **Fast & Efficient** - Optimized for bulk checking  

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/discord-username-checker.git
   cd discord-username-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (optional)
   ```
   PORT=3000
   DISCORD_BOT_TOKEN=your_bot_token_here
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Check Single Username
```bash
POST /api/check
Content-Type: application/json

{
  "username": "sharky"
}
```

**Response:**
```json
{
  "available": true,
  "username": "sharky",
  "checked": true
}
```

### Check Multiple Usernames
```bash
POST /api/check-bulk
Content-Type: application/json

{
  "usernames": ["user1", "user2", "user3"]
}
```

### Get Statistics
```bash
GET /api/stats
```

**Response:**
```json
{
  "checked": 100,
  "available": 35,
  "taken": 65,
  "availabilityPercentage": "35.00"
}
```

### Reset Statistics
```bash
POST /api/reset-stats
```

## Username Rules

Discord usernames must follow these rules:
- **Length:** 2-32 characters
- **Characters:** Letters (a-z, A-Z), numbers (0-9), underscores (_), hyphens (-), and periods (.)
- **Reserved:** Certain usernames are reserved by Discord

## Frontend Features

- ✅ Real-time username availability checking
- ✅ Start filtering by initial letter
- ✅ Live statistics display
- ✅ Availability percentage tracking
- ✅ Responsive grid layout for results
- ✅ Discord webhook URL configuration
- ✅ Live checking status indicator

## Project Structure

```
.
├── server.js              # Express server & API
├── package.json           # Dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/
    ├── index.html        # Frontend HTML
    ├── styles.css        # Styling
    └── script.js         # Frontend JavaScript
```

## Configuration

### Webhook Integration
You can optionally configure a Discord webhook to receive notifications when available usernames are found:

1. Copy your webhook URL in the Configuration section
2. Click "SAVE" to store it (saved in browser localStorage)
3. The app will send notifications when usernames are available

## Technology Stack

- **Backend:** Node.js, Express
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **API Communication:** Fetch API
- **Storage:** Browser LocalStorage

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Disclaimer

This tool is for educational purposes. Please use responsibly and in accordance with Discord's Terms of Service.

## Support

If you encounter any issues, please:
1. Check that all dependencies are installed (`npm install`)
2. Ensure you're using Node.js version 14 or higher
3. Open an issue on GitHub with details about the problem

---

**Happy checking! 🚀**
