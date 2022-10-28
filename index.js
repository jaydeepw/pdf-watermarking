//import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
const PdfLib = require('pdf-lib');
var qpdf = require('node-qpdf');
const Processor = require('encrypt-decrpt-pdf').PDFProcessor;
const fs = require('fs');

const watermarkPdf = () => {
    console.log('ready to watermark');
    // console.log('PDFDocument: ', PDFDocument);
    // console.log('degrees: ', PDFDocument.degrees);
    // console.log('StandardFonts: ', PDFDocument.StandardFonts);
    const result = fs.readFile('./sample.pdf', async function read(err, data) {
        if (err) {
            throw err;
        }
        const existingPdfBytes = data;
        // console.log(existingPdfBytes);
        const pdfDoc = await PdfLib.PDFDocument.load(existingPdfBytes)
        const helveticaFont = await pdfDoc.embedFont(PdfLib.StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]

        const { width, height } = firstPage.getSize()

        // Draw a string of text diagonally across the first page
        firstPage.drawText('This text was added with JavaScript!', {
            x: width / 2 - 200,
            y: height / 2 - 150,
            size: 30,
            font: helveticaFont,
            color: PdfLib.rgb(0.95, 0.1, 0.1),
            rotate: PdfLib.degrees(45),
        })

        const pdfBytes = await pdfDoc.save()
        // console.log('pdfBytes: ', pdfBytes)
        const localFilePath = './new.pdf';
        fs.writeFile(localFilePath, pdfBytes, async function (err) {
            if (err) throw err;
            console.log('Saved!');
            var childProcess = require("child_process");
            var oldSpawn = childProcess.spawn;
            async function mySpawn() {
                const options = {
                    keyLength: 128,
                    password: 'supernova'
                }
                await qpdf.encrypt('new2.pdf', options);
            }
            childProcess.spawn = mySpawn;

            // const password = 'supernova';
            // const processor = new Processor(password);
            // processor
            //     .encrypt(localFilePath, 'new2.pdf')
            //     .then(data => console.log(data))
            //     .catch(err => console.log(err));
        });
    });
}

watermarkPdf();