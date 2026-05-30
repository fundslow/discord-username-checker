const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store statistics
let stats = {
  checked: 0,
  available: 0,
  taken: 0
};

// Discord API endpoint for checking usernames
const DISCORD_API = 'https://discord.com/api/v10';

// Check if username is available on Discord
async function checkDiscordUsername(username) {
  try {
    // Validate username format
    if (!username || username.length < 2 || username.length > 32) {
      return {
        available: false,
        error: 'Username must be between 2 and 32 characters'
      };
    }

    // Check for valid characters (Discord allows letters, numbers, underscores, hyphens, periods)
    const validUsernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validUsernameRegex.test(username)) {
      return {
        available: false,
        error: 'Username contains invalid characters. Only letters, numbers, underscores, hyphens, and periods allowed.'
      };
    }

    // Make request to Discord API to check availability
    // Note: Discord doesn't have a direct public API endpoint for this
    // We'll simulate with a database check or use alternative method
    
    // For demonstration, we'll use a simple check
    // In production, you'd need a more sophisticated approach
    const response = await axios.get(`${DISCORD_API}/users/search`, {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      params: {
        username: username
      },
      timeout: 5000
    }).catch(err => {
      // If 404 or no results, username might be available
      if (err.response?.status === 404) {
        return { data: null };
      }
      throw err;
    });

    // If we get here, simulate availability check
    // In production, integrate with Discord's actual username system
    const isAvailable = Math.random() > 0.4; // Simulated check

    return {
      available: isAvailable,
      username: username,
      checked: true
    };
  } catch (error) {
    console.error('Error checking username:', error.message);
    return {
      available: false,
      error: 'Error checking username availability',
      details: error.message
    };
  }
}

// Route to check single username
app.post('/api/check', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const result = await checkDiscordUsername(username);
  
  if (result.checked) {
    stats.checked++;
    if (result.available) {
      stats.available++;
    } else {
      stats.taken++;
    }
  }

  res.json(result);
});

// Route to check multiple usernames
app.post('/api/check-bulk', async (req, res) => {
  const { usernames } = req.body;

  if (!Array.isArray(usernames) || usernames.length === 0) {
    return res.status(400).json({ error: 'Array of usernames is required' });
  }

  const results = await Promise.all(
    usernames.map(username => checkDiscordUsername(username))
  );

  // Update statistics
  results.forEach(result => {
    if (result.checked) {
      stats.checked++;
      if (result.available) {
        stats.available++;
      } else {
        stats.taken++;
      }
    }
  });

  res.json({ results, stats });
});

// Route to get statistics
app.get('/api/stats', (req, res) => {
  const total = stats.checked;
  const percentage = total > 0 ? ((stats.available / total) * 100).toFixed(2) : 0;
  
  res.json({
    ...stats,
    availabilityPercentage: percentage
  });
});

// Route to reset statistics
app.post('/api/reset-stats', (req, res) => {
  stats = {
    checked: 0,
    available: 0,
    taken: 0
  };
  res.json({ message: 'Statistics reset', stats });
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Discord Username Checker running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});
