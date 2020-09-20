const cheerio = require('cheerio');
const request = require('request');
class CheerioService {

  async getLastThreePostsFromInstagramById(acc, n) {
   const URL = `https://www.picuki.com/profile/${acc}`;
   console.log(URL);
     return new Promise((resolve,reject) => {
           request(URL, function (err, res, body) {
               if(err)
               {
                   return reject(error);
               }
               else
               {
                   let $ = cheerio.load(body);
                   const arr = [];
                    $('img.post-image').each(function(index){
                         const src = $(this).attr('src');
                         arr.push(src)
                     });
                  return resolve(arr.slice(0, 3));
               }
           });
      });

  }
}

const cheerioService = new CheerioService();

module.exports = cheerioService;