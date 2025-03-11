import webbrowser

Protocol = 'https://'
Google = 'www.google.com'
Bing = 'www.bing.com'
DuckDuckGo = 'www.duckduckgo.com'
SearchEngine = [Google, Bing, DuckDuckGo]

webbrowser.open_new(f"{Protocol}{SearchEngine[0]}")
