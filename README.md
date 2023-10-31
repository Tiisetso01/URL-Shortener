# URL Shortener Microservice

This site Shorten URL, user submit original URL they want to shorten for example ( https://www.google.com )
ou can POST a URL to https://boilerplate-project-urlshortener.tiisetsommaboko.repl.co/api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://www.google.com', short_url : 1}
When you visit https://boilerplate-project-urlshortener.tiisetsommaboko.repl.co/api/shorturl/<short_url>, you will be redirected to the original URL.
'<short_url> = number'
