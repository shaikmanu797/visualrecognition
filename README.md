Assignment-7 by:-

Mansoor Baba Shaik
Siddharth Hathi

URL for Web Application:-
http://recog.mybluemix.net/

Web Application Architecture:-
Runtime: Node.js
Service: Watson Developer Cloud - Visual Recognition
Memory used for an instance: 512MB
Modules installed in the web application are as following:
1.	cfenv – cloud foundry environment.
2.	routes – To route the app.js to the specified web page (mainly used it to load index page in our web application on request to root ‘/’)
3.	http  – To handle HTTP requests and responses.
4.	multer  – To upload files to a web server directory.
5.	body-parser  – To parse the body HTML content returned from a HTTP response.
6.	path  – To set the path for the public directory which has webpages.
7.	morgan – To log the HTTP status codes easy for developer to understand the request, response and error codes for easy debugging.
8.	watson-developer-cloud  – This modules allows us to connect to the services that can be used for cognitive computing with the help of access credentials specified in the bluemix environment of our account.
9.	fs  – This allows us to handle the file system.


Process involved:    When an image file is uploaded from the home page (index.html), the multer module saves the uploaded file in the specified path of server directory. Since, multer saves file with no extension, the uploaded file is renamed using fs module with the help of fs.rename() method and .jpg extension is added explicitly. Now, the file has an extension of .jpg and no matter what kind of image is uploaded it gets converted to .jpg format. 

The uploaded image is read and streamed into the Watson visual recognition service. The visual recognition service reads the streamed content and retrieves the matching classifiers (contains classifier id, name, score key-value pairs) based on the streamed content received from request. The retrieved result set is sent back as a response to the requested webpage.

We have created two dynamic webpages (‘/json’ and ‘/table’) that sends the request to the visual recognition service and renders the returned response in the form of JSON and HTML table format respectively.



