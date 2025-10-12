
# 📱 Run Markets Dashboard on Your iPhone

## Quick Setup Guide

### Step 1: Find Your Mac's IP Address

Your backend is already showing the IP address. Look at your backend terminal for a line like:
```
* Running on http://10.29.177.105:5001
```

The IP address is: **10.29.177.105** (yours may be different)

Or run this command to find it:
```bash
ipconfig getifaddr en0
```

### Step 2: Start the App

Make sure both servers are running:

**Backend:**
```bash
cd /Users/arturofavara/Desktop/App_Markets/backend
source venv/bin/activate
python app.py
```

**Frontend:**
```bash
cd /Users/arturofavara/Desktop/App_Markets/frontend
npm run dev
```

You should see something like:
```
➜  Local:   http://localhost:3000/
➜  Network: http://10.29.177.105:3000/
```

### Step 3: Access from iPhone

1. **Make sure your iPhone and Mac are on the same WiFi network**

2. **Open Safari** on your iPhone (must use Safari for PWA features)

3. **Navigate to:** `http://10.29.177.105:3000` 
   (Replace with your actual IP address)

### Step 4: Install as App on Home Screen

1. Tap the **Share button** (square with arrow pointing up) at the bottom of Safari

2. Scroll down and tap **"Add to Home Screen"**

3. Give it a name (e.g., "Markets") and tap **Add**

4. The app icon will appear on your home screen! 📊

### Step 5: Use the App

- Tap the new Markets icon on your home screen
- It will open in **full-screen mode** (no Safari UI)
- Works just like a native app!
- All live data updates automatically

## Troubleshooting

### Can't connect from iPhone?

**Check your Mac's firewall:**
```bash
# Temporarily disable firewall (re-enable after testing)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off

# Or allow Python through firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/python3
```

**Make sure you're on the same WiFi:**
- Mac and iPhone must be on the same network
- Corporate/public WiFi may block device-to-device communication

### Find your IP address:
```bash
# WiFi (en0)
ipconfig getifaddr en0

# Ethernet (en1)
ipconfig getifaddr en1

# Or see all network info
ifconfig | grep "inet " | grep -v 127.0.0.1
```

## Pro Tips

- **Keep your Mac awake** while using the app on iPhone
- The app will work as long as both servers are running
- Bookmark the IP address URL in case you need to reinstall
- If your Mac's IP changes, you'll need to access the new IP

## Making it Permanent (Optional)

To avoid IP address changes:

1. **Set a static IP** on your Mac in System Settings → Network

2. **Or use a hostname:**
   - Access via `http://YourMacName.local:3000`
   - Find your Mac's name in System Settings → Sharing

## Features on iPhone

✅ Full-screen app experience  
✅ All live market data  
✅ Interactive charts  
✅ Real-time news updates  
✅ Works offline (after first load)  
✅ Fast and responsive  

Enjoy your professional markets dashboard on the go! 🚀📱

