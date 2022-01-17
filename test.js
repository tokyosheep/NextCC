const fs = require('fs');
const path = require('path');

const dir_home = process.env[process.platform == `win32` ? `USERPROFILE` : `HOME`];
const dir_desktop = path.join(dir_home, `Desktop`);//デスクトップパス

(async()=>{
    const r = await fs.promises.readFile(`${dir_desktop}/ff.png`);
    console.log(r);
})();