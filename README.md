# Creative Cloud Libraries API on Next.js(React)

this is an example of how to write Adobe Creative Cloud Libraries API on Next.js
Creative Cloud Libraries API can connec CC server through OAuth authorization.
user can see its own libraries. even it can upload image and get asset.
but I think many developers are curious to run API on React base system. 
this isn't good exmaple I suppose but I hope it can help for some developers. 

**I refered to the sample code amandahuarng wrote**
 
[sample code](https://github.com/AdobeDocs/cc-libraries-api-samples/tree/main/oauth-node-cclibs)
[her blog](https://medium.com/adobetech/node-js-oauth-2-0-integration-with-creative-cloud-libraries-api-a7b2b2992897)

this sample based on ejs and Express not React but to me it was really helpful to understand Adobe Creative Cloud Libraries API.
I strongly recommend to read it before launch my code.

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

if you create your project , get your Client ID (API key) and Client Secret (API secret) , and fill key in .ext.example file as an environment variables
and rename .ext.example to .ext file.

you have to run https(not http) server so you need certificates. install [mkcert](https://github.com/FiloSottile/mkcert) and generate certificates.

install node_modules. typeing "npm install" in this directory. 

finally you can run server. typing "npm run dev" and server will be running.
and access to "https://localhost:3000/" you'll see how code runs.
once you login CC, you'll see your libraries on browser. each library has their assets.
click the button "get representations" then it shows asset's details.

[here](https://medium.com/adobetech/node-js-oauth-2-0-integration-with-creative-cloud-libraries-api-a7b2b2992897)

**please check the .gitignore . it inculdes localhost(certificate file) and .env file or not**
do not upload these files. it must be confidential files.

## basic functions

Creative Cloud Libraries API has many Library Services. for now I built these below

1. #### login your account and logout
through OAuth authorization , you could sign in your CC account.

2. #### upload image
upload image from your local directory to Creative Cloud. but it can upload file within 5MB.

3. #### get assets from Creative Cloud Libraries
download asset to your desktop directory.
some asset(like XD component file)has more than two kind of representations.(PNG, SVG, AGC).
and spot color data has only json data(it doesn't have specific image).
Creative Cloud Libraries API can deal many kind of file, but I haven't checked all of files yet.

## how code runs server briefly

1. #### custom server
to run https server on local , you have to use custom server, I built it in server directory.
if you want to insert middleware or something , customize the file.
[detail is here](https://nextjs.org/docs/advanced-features/custom-server)

2. #### server side
directory in pages -> api -> ccAccess -> "[id].ts" 
this file receives access from browser side. and it branches each function which depends on URL and method.

more details , see comment in codes.
if you need more basic knowledge refer to links below.

1. [Next.js](https://nextjs.org/)

2. [Creative Cloud API tutorial](https://www.adobe.io/creative-cloud-libraries/docs/integrate/tutorials/quick-start-nodejs/)

3. [Creative Cloud API Reference](https://www.adobe.io/creative-cloud-libraries/docs/api/)