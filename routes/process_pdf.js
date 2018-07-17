const path = require('path');
const fs = require('fs');
const pdf = require('pdf-poppler');

var formidable = require('formidable');

var express = require('express');
var router = express.Router();




/* GET home page. */
router.post('/', function (req, res, next) {


  var pdfname = req.query.pdf;
  // var uploaded_pdf = path.join(__dirname, '../public/UPLOAD', pdfname)

  

  // NODEJS file upload
  // http://shiya.io/simple-file-upload-with-express-js-and-formidable-in-node-js/
  // it only works with post
  // https://www.diycode.cc/projects/felixge/node-formidable
  
  var form = new formidable.IncomingForm();
  form.parse(req);

  form.on('fileBegin', function (name, file){
      file.path = path.join(__dirname , '../public/UPLOAD/' , file.name);
  });

  form.on('file', function (name, file){

    // UPLOAD COMPLETE
    console.log('Uploaded ' + file.name);
    //   res.send('Uploaded ' + file.name)


    // CREATE IMAGES FROM UPLOADED PDF
    create_image(file.path,file.name)

    
// 
  });


});



function create_image(filepath,filename){

    // var file = filepath;
 
// let file = 'Agniputra - Sunil Ganggopaddhya [amarboi.com].pdf'
console.log("calling split")
 
let opts = {
    format: 'jpeg',
    out_dir: path.dirname(filepath),
    // out_prefix: path.baseName(file, path.extname(file)),
    out_prefix: filename,
    page: null
}
 
pdf.convert(filepath, opts)
    .then(res => {
        console.log('Successfully converted');

        // REMOVE THE PDF
        fs.unlinkSync(filepath)
        // CREATE IMAGELIST
        var UPLOAD = path.join(__dirname,'../public/UPLOAD')
        // console.log(UPLOAD)
        var data = fs.readdirSync(UPLOAD)

        data.forEach(element => {

            fs.appendFileSync(path.join(UPLOAD,'../imagelist.txt'),path.join(UPLOAD,element)+'\n')    
          
        })

        // CALL TESSERACT
        
    })
    .catch(error => {
        console.error(error);
    })
}




module.exports = router;
