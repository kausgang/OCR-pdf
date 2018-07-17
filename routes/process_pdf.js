const path = require('path');
const fs = require('fs');

// FOR EXTRACTING IMAGE FROM PDF
const pdf = require('pdf-poppler');

// FOR UPLOADING PDF ...THIS CA BE REPLACED BY MORE ADVANCED MODULE
var formidable = require('formidable');
// FOR RUNNING TESSERACT
const { exec } = require('child_process');

var express = require('express');
var router = express.Router();




/* GET home page. */
router.post('/', function (req, res, next) {


    // var {language,start,end,pdf} = req.body;
    // // var language = req.query.language,
    // // start = req.query.start,
    // // end = req.query.end;

    // 
 
    // res.send(a)

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
    // res.send('Uploaded ' + file.name)
    // res.render('process_pdf',{

    //     language:
    // })


    // CREATE IMAGES FROM UPLOADED PDF
    create_image(file.path,file.name,res)

    
// 
  });


});



function create_image(filepath, filename, res) {


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
            var UPLOAD = path.join(__dirname, '../public/UPLOAD')
            // console.log(UPLOAD)
            var data = fs.readdirSync(UPLOAD)

            data.forEach(element => {

                fs.appendFileSync(path.join(UPLOAD, '../imagelist.txt'), path.join(UPLOAD, element) + '\n')

            })

            // CALL TESSERACT
            var imagelist = path.join(UPLOAD, '../imagelist.txt');
            exec("start tesseract -l ben " + imagelist + " output", (err, stdout, stderr) => {
                if (err) throw err;
                // console.log(s)
            })



        })
        .catch(error => {
            console.error(error);
        })

    res.send("tesseract working")


}




module.exports = router;
