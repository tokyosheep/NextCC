const { redirect } = require("express/lib/response");

module.exports = {
  reactStrictMode: true,
  async redirect(){
    return [
      {
        source: 'https://ims-na1.adobelogin.com/callback/**/*',
        destination: './',
        permanent: false
      }
    ]
  }
}
