# Creative Cloud Libraries API on Next.js(React)

this is an example of how to write Adobe Creative Cloud Libraries API on Next.js
Creative Cloud Libraries API can connec CC server through OAuth authorization.
user can see its own libraries. even it can upload image and get asset.
but I think many developers are curious to run API on React base system. 

**I refered to the sample code amandahuarng wrote**
 
[sample code](https://github.com/AdobeDocs/cc-libraries-api-samples/tree/main/oauth-node-cclibs)
[her blog](https://medium.com/adobetech/node-js-oauth-2-0-integration-with-creative-cloud-libraries-api-a7b2b2992897)

this sample based on ejs and Express not React but to me , it was really helpful to understand Adobe Creative Cloud Libraries API.
I recommend read it before launch my code.

# what user this code for
you need basic knowledge below

1. Next.js

3. Node.js

4. html css


## how does it run

[first you need to register Adobe console as a developer](https://www.adobe.io/console)
after register acoound , create project. you can check how create your Creative Cloud Libraries API 
project

you can read more detail about console [here.](https://www.adobe.io/developer-console/docs/guides/getting-started/)

if you create your project , get your Client ID (API key) and Client Secret (API secret) , and fill key in .ext.example file
and rename .ext.example to .ext file.

**do not publish your API KEY anywhere**

you have to run https(not http) server so you need certificates. install [mkcert](https://github.com/FiloSottile/mkcert) and generate certificates.

of course do not forget install node_modules. typeing "npm install" in this directory. 

and finally you cab run server. typeing "npm run dev" and server will be running.
and access "https://localhost:3000/" you'll see how code runs.

[here](https://medium.com/adobetech/node-js-oauth-2-0-integration-with-creative-cloud-libraries-api-a7b2b2992897)

**please check the .gitignore . it inculdes localhost(certificate file) and .env file or not**
do not upload these files.
