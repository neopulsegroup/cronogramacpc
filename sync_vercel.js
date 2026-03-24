const fs = require('fs');

fetch('https://cronogramacpc.vercel.app/api/data')
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('localData.json', JSON.stringify(data, null, 2));
    console.log('Successfully synced localData.json with Vercel remote database!');
  })
  .catch(err => {
    console.error('Error fetching data from Vercel:', err);
    process.exit(1);
  });
