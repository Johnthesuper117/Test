import webbrowser
import ipaddress
import socket
import requests

try: 
    hostname = socket.gethostname()    
    ipv4_address = socket.gethostbyname(hostname)    
    print(f"Internal IPv4 Address for {hostname}: {ipv4_address}")
except socket.gaierror:    
    print("There was an error resolving the hostname.")
except Exception as e:    
    print(f"An unexpected error occurred: {e}")

Protocol = 'https://'
Google = 'www.google.com'
Bing = 'www.bing.com'
DuckDuckGo = 'www.duckduckgo.com'
SearchEngine = [Google, Bing, DuckDuckGo]

# Define the IP address and domain
ip_address = "93.184.216.34"  # Example IP address for example.com
domain = "example.com"  # The domain you are trying to reach

# Construct the URL with the IP address
url = f"http://{ip_address}"

# Make the request with a Host header
response = requests.get(url, headers={"Host": domain})

# Print the response content
print(response.text)
print(ipaddress.ip_address(ipv4_address))
print(ipaddress.ip_network(ipv4_address, strict=True))
webbrowser.open_new(f"{Protocol}{SearchEngine[0]}")
