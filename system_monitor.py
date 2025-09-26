import psutil
import eel
import socket
import os

# Initialize Eel
frontend_dir = os.path.join(os.path.dirname(__file__), 'WEB')
eel.init(frontend_dir)

# Initialize previous network stats
net_prev = psutil.net_io_counters()
psutil.cpu_percent(interval=None)  # warm-up

@eel.expose
def get_stats():
    global net_prev

    # CPU, RAM, Disk
    cpu = psutil.cpu_percent(interval=0.1)
    ram = psutil.virtual_memory().percent
    disk = psutil.disk_usage('/').percent

    # Battery
    battery = psutil.sensors_battery()
    batt_percent = battery.percent if battery else 0

    # Network
    net_now = psutil.net_io_counters()
    upload = (net_now.bytes_sent - net_prev.bytes_sent) / 1024
    download = (net_now.bytes_recv - net_prev.bytes_recv) / 1024
    net_prev = net_now

    print(f"CPU={cpu:.2f}% RAM={ram:.2f}% Disk={disk:.2f}% "
          f"Battery={batt_percent:.2f}% Upload={upload:.2f}KB Download={download:.2f}KB")

    return {
        "cpu": round(cpu, 2),
        "ram": round(ram, 2),
        "disk": round(disk, 2),
        "battery": round(batt_percent, 2),
        "net_upload": round(upload, 2),
        "net_download": round(download, 2)
    }

# Start Eel (no manual webbrowser.open, Eel handles Brave itself)
eel.start(
    'index.html',
    size=(360, 700),
    mode='brave',   # Force Brave instead of Chrome
    cmdline_args=[
        '--app',
        '--window-size=360,700',
        '--window-position=1500,10',
        '--disable-infobars',
        '--kiosk-printing',
        '--no-default-browser-check'
    ]
)
