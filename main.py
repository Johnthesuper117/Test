import webbrowser
import ipaddress


Protocol = 'https://'
Google = 'www.google.com'
Bing = 'www.bing.com'
DuckDuckGo = 'www.duckduckgo.com'
SearchEngine = [Google, Bing, DuckDuckGo]
address = 
print(ipaddress.ip_address(address))
webbrowser.open_new(f"{Protocol}{SearchEngine[0]}")
