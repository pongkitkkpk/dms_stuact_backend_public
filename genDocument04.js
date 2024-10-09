
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

// Function to generate the document based on the provided data
async function generateDocument(data) {
    try {
        // Load the template file
        const content = fs.readFileSync(path.resolve(__dirname, "template.docx"), "binary");
        
        // Unzip the content of the file
        const zip = new PizZip(content);

        // Create a Docxtemplater instance
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // Render the document
        doc.render(data);

        // Generate the output buffer
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });

        return buf; // Return the generated buffer
    } catch (error) {
        throw error;
    }
}

module.exports = generateDocument;
