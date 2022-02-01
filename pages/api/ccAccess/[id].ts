import axios from 'axios';
import dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';
import { getBase64dataUrl } from './fileSystem';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import multer from 'multer';

const upload = multer ({ dest: './temp' });
/*
multer makes img file from input form on browser side available
brower side can't access local file directory. you need multer to access local
*/

const dir_home = process.env[process.platform == `win32` ? `USERPROFILE` : `HOME`];
const dir_desktop = path.join(dir_home, `Desktop`);//デスクトップパス

dotenv.config();

const baseURL = 'https://cc-libraries.adobe.io/api/v1/libraries';
const scopes = 'openid,creative_sdk,profile,address,AdobeID,email,cc_files,cc_libraries';
const redirectUri = 'https://localhost:3000/api/ccAccess/callback';
let accessToken = '';

const logoutAdobeCC = async (req,res) => {
  try{
    accessToken = '';
    res.redirect('https://localhost:3000/logout');
  }catch(e){
    console.log(e);
    res.redirect('https://localhost:3000');
  }
}

const loginAdobeCC = async (req,res) => {
  // jumpo to login page on Adobe server
  try{
    res.redirect(307,`https://ims-na1.adobelogin.com/ims/authorize/v2?client_id=${process.env.API_KEY}&scope=${scopes}&response_type=code&redirect_uri=${redirectUri}`);
    /* if you success to login, you'll jump to callback page */
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

const otherInquiry = async(req,res) => {
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


/*http://gaforum.jp/?s=gaiq query parameter */
const getElement = async(req,res) =>{
  console.log(req.body);
  const options = {
    headers: {
      'x-api-key': process.env.API_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  };
  try {
    const response = await axios.get(`${baseURL}/${req.body.id}/elements/?selector=details`, options);
    res.json({ element: response.data });
  } catch (e) {
    console.log(e);
    res.send('error');
  }
}

const getElementRepresent = async (req,res) =>{
  const options = {
    headers: {
      'x-api-key': process.env.API_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  };
  try{
    const response = await axios.get(`${baseURL}/${req.body.id}/elements/?selector=representations`, options);
    res.json({ element: response.data });
  }catch(e){
    console.log(e);
    res.json({error:'error'});
  }
}

const getImage = async (req,res) => {
  let { url } = req.body;
  url = url.slice(0, url.lastIndexOf("/"));
  console.log(url);
  const options:any = {
    responseType: 'arraybuffer',
    headers: {
      'x-api-key': process.env.API_KEY,
      Authorization: `Bearer ${accessToken}`
    },
  };
  try{
    const thumb = await axios.get(url, options);
    console.log(thumb);
    const dataUrl = getBase64dataUrl(thumb);
    console.log(dataUrl);
    res.set("Content-Type", thumb.headers["content-type"]);
    res.set("Content-Length", thumb.headers["content-length"]);
    const r = thumb?.data === undefined ? null : thumb?.data;
    res.json({v:dataUrl});
  }catch(e){
    console.log(e);
    res.json({v:'error'});
  }
}

const getFile = async (req,res) => {
  const options:any = {
    responseType: 'arraybuffer',
    headers: {
      'x-api-key': process.env.API_KEY,
      Authorization: `Bearer ${accessToken}`
    },
  };
  const { url } = req.body;
  const { name } = req.body;
  console.log('-----');
  console.log(url);
  console.log(name);
  try{
    const response = await axios.get(url, options);
    console.log(response);
    await fs.promises.writeFile(`${dir_desktop}/${name}`,response.data);
    res.json({data:response.data});
  }catch(e){
    console.log(e);
    res.json(e);
  }
}

const uploadAsset = async (libraryUrn, file, req) =>{
  /*

  I warn you
  this method can upload within 5MB size file
  some file over 5MB, you have to find other way

  */

  const imgData = (() => {
    try{
      const imgData = fs.createReadStream(file.path);
      return imgData;
    }catch(e){
      console.log('error');
      console.log(e.message);
      return null
    }
  })();
  if(imgData===null)return null;
  const formData = new FormData();
  formData.append('Representation-Content', imgData, 'asset');
  formData.append(
    'Representation-Data',
    JSON.stringify({ type: file.mimetype })
  );

  const options:any = {
    method: 'post',
    headers: {
      'x-api-key': process.env.API_KEY,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    },
    url: `${baseURL}/${libraryUrn}/representations/content`,
    data: formData,
  }

  try{
    const response = await axios(options);
    return response.data;
  }catch(e){
    console.log('impossible to upload');
    console.log(e);
    throw e;
  }
}

const createElement = async (libraryUrn, file, thumbnail, req) =>{
    const elementData = {
      name: file.originalname,
      type: 'application/vnd.adobe.element.image+dcx',
      client: {
        deviceId: 'Device ID',
        device: 'Device name',
        app: 'App name'
      },
      representations: [
        {
          name: file.originalname,
          type: file.mimetype,
          relationship: 'rendition',
          'storage_href': thumbnail.storage_href,
          'content_length': thumbnail.content_length,
          etag: thumbnail.etag,
          md5: thumbnail.md5,
          version: thumbnail.version
        },
      ]
    }
    console.log(elementData);
    const options:any = {
      method: 'post',
      headers: {
        'x-api-key': process.env.API_KEY,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      url: `${baseURL}/${libraryUrn}/elements`,
      data: elementData,
    };
    console.log(options);
    try{
      const response = await axios(options);
      return response.data;
    }catch(e){
      console.log(e.message);
      return 'error';
    }
}

const insertElement = async (req,res) =>{
  const body:any = await new Promise((resolve,reject) => {
    upload.single('file')(req, res , (err:any) => {
      if(err)reject(err);
      console.log(req);
      resolve({ file:req.file, libraryUrn:req.body.id });
    })
  });
  let thumbnail;
  /*
    first upload image file
  */
  try{
    thumbnail = await uploadAsset(body.libraryUrn, body.file, req);
    console.log(thumbnail);
  }catch(e){
    console.log('error');
    console.log(e.message);
    res.send('error');
  }
  /*
    create asset object and insert to server
  */
  try{
    const responseJson = await createElement(body.libraryUrn, body.file, thumbnail, req);
    console.log(responseJson);
    res.send('success');
  }catch(e){
    console.log(e.message);
    res.send('error');
  }
}

/*
  branch to each functions. it depends on url and method
*/

export default async function handler(req:NextApiRequest,res:NextApiResponse,next){
  console.log(req.method);
  const id = req.query.id;
  console.log(id);
  if(req.method==='POST'){
    switch(id){
      case 'element-represent':
        await getElementRepresent(req,res);
        break;

      case 'upload':
        await insertElement(req,res);
        break;

      case 'get-libraries-file':
        await getFile(req,res);
        break;

      default:
        otherInquiry(req,res);
        break;
    }
  }else{  
    switch(id){
      case 'login':
        loginAdobeCC(req,res);
        break;

      case 'logout':
        logoutAdobeCC(req,res);
        break;

      case 'callback':
        await callbackLogin(req,res);
        break;

      case 'element':
        await getElement(req,res);
        break;

      case 'cc-libraries-images':
        await getImage(req,res);
        break;

      default:
        otherInquiry(req,res);
        break;
    }
  }
}