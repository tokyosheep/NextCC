import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const baseURL = 'https://cc-libraries.adobe.io/api/v1/libraries';
const scopes = 'openid,creative_sdk,profile,address,AdobeID,email,cc_files,cc_libraries';
const redirectUri = 'https://localhost:3000/api/ccAccess/callback';
let accessToken = '';

const loginAdobeCC = async (req,res) => {
  try{
    res.redirect(307,`https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${process.env.API_KEY}&scope=${scopes}&response_type=code&redirect_uri=${redirectUri}`);
  }catch(e){
    console.log(e);
    res.status(500).send({ error: 'failed to fetch data' });
  }
}

const callbackLogin = async(req,res) => {
  const code = req.query.code;
  const grantType_ = 'authorization_code';
  const uri = `https://ims-na1.adobelogin.com/ims/token/v3?grant_type=authorization_code&client_id=${process.env.API_KEY}&client_secret=${process.env.API_SECRET}&code=${code}&grant_type=${grantType_}`;
  try {
    const response = await axios.post(uri);
    accessToken = response.data.access_token;
    req.session.refreshToken = response.data.refresh_token;
    res.redirect('https://localhost:3000/');
  } catch (error) {
    console.log(error);
    res.redirect('https://localhost:3000/failed');
  }
}

export default async function handler(req,res){
    console.log(req.query.id);
    const id = req.query.id;
    if(id==='login'){
        loginAdobeCC(req,res);
    } else if(id==='callback'){
        await callbackLogin(req,res);
    }else{
        const options = {
          headers: {
            "x-api-key": process.env.API_KEY,
            Authorization: `Bearer ${accessToken}`,
          },
        };
        try{
            const response = await axios.get(baseURL, options);
            res.json({
              title: 'Creative Cloud Libraries API',
              libraries: response.data.libraries
            });
        }catch(error){
            res.json({
              title: 'Creative Cloud Libraries API',
              libraries: undefined
            });
        }
    }
}