// Function to update all system statistics
async function updateStats() {
    try {
        // Correct and clean call to the Python function
        const stats = await eel.get_stats()();

        // Debugging: Log the received data to the console
        console.log("Received stats:", stats);

        // Check if stats object and its properties exist before updating
        if (stats && typeof stats === 'object') {
            document.querySelector("#cpu .value").innerText = stats.cpu.toFixed(2) + '%';
            document.querySelector("#ram .value").innerText = stats.ram.toFixed(2) + '%';
            document.querySelector("#disk .value").innerText = stats.disk.toFixed(2) + '%';

            document.getElementById('upload').innerText = stats.net_upload.toFixed(2) + ' KB/s';
            document.getElementById('download').innerText = stats.net_download.toFixed(2) + ' KB/s';

            if (stats.battery !== undefined) {
                document.getElementById('battery-pill').style.setProperty('--charge', stats.battery + '%');
                document.getElementById('battery-state').innerText = stats.battery.toFixed(2) + '%';
            } else {
                document.getElementById('battery-pill').style.setProperty('--charge', '0%');
                document.getElementById('battery-state').innerText = 'N/A';
            }
        } else {
            console.warn("Eel returned an invalid object. Retrying...");
        }

    } catch (error) {
        // Log the error to the console for debugging
        console.error("Failed to fetch stats from Python:", error);
    }
}

// Function to update the clock and uptime
function updateTime() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();

    const uptimeSec = Math.floor(performance.now() / 1000);
    const hours = Math.floor(uptimeSec / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    document.getElementById('uptime').innerText = `Uptime: ${hours}h ${mins}m`;
}

// Initial and recurring update logic
// Using a self-calling async function for initial setup
(async () => {
    // Await the first successful update before setting the interval
    await updateStats();
    
    // Set up recurring updates
    setInterval(updateStats, 2000);
    setInterval(updateTime, 1000);
})();