import webbrowser
import ipaddress
import socket
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
print(ipaddress.ip_address(ipv4_address))
print(ipaddress.ip_network(ipv4_address, strict=True))
webbrowser.open_new(f"{Protocol}{SearchEngine[0]}")
