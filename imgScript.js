const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Input directory containing the textures
const inputDir = path.join(__dirname, 'src/textures/create/base');
// Base output directory to store processed images and CSS
const outputDirBase = path.join(__dirname, 'src/textures/create/cutted');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirBase)) {
    fs.mkdirSync(outputDirBase);
}

// Define the sections to extract from the image (coordinates and size)
const sections = {
    "top_left": [80, 32, 16, 16],
    "top_right": [80 , 16, 16, 16],
    "bottom_left": [64, 32, 16, 16],
    "bottom_right": [64, 16, 16, 16],
    "top": [32, 112, 16, 16],
    "bottom": [32, 96, 16, 16],
    "left": [32, 80, 16, 16],
    "right": [32, 64, 16, 16],
    "middle": [96, 96, 16, 16],
};

// Function to process each image
function processImage(inputPath, outputDir) {
    const cssLines = []; // Array to store the CSS rules for each section
    const tasks = Object.entries(sections).map(([name, [left, top, width, height]]) => {
        const outputFilePath = path.join(outputDir, `${name}.png`); // Path for the output file
        return sharp(inputPath)
            .extract({ left, top, width, height }) // Extract the specified section
            .toFile(outputFilePath) // Save the extracted section as a PNG file
            .then(() => {
                // Default CSS properties
                let position = "top left";
                let repeat = "no-repeat";

                // Modify repeat based on the section type
                if (name === "top" || name === "bottom") {
                    repeat = "repeat-x";
                } else if (name === "left" || name === "right") {
                    repeat = "repeat-y";
                } else if (name === "middle") {
                    repeat = "repeat";
                }

                // Modify position based on the section name
                if (name.endsWith("_right")) {
                    position = "top right";
                } else if (name.startsWith("bottom")) {
                    position = "bottom left";
                } else if (name === "bottom_right") {
                    position = "bottom right";
                }

                // Push the CSS rule for this section to the array
                cssLines.push(`url('../textures/${path.basename(outputDir)}/${name}.png') ${position} ${repeat},`);
            });
    });

    // Wait for all tasks to finish and generate the CSS file
    Promise.all(tasks)
        .then(() => {
            // Join all CSS lines and remove the last comma
            const cssOutput = cssLines.join('\n').replace(/,$/, '');
            // Write the CSS file to the output directory
            fs.writeFileSync(path.join(outputDir, 'styles.css'), cssOutput);
            console.log(`Cropping completed and CSS generated in ${outputDir}`);
        })
        .catch(err => {
            console.error('Error processing the images:', err);
        });
}

// Loop through the source directory to process each image file
fs.readdirSync(inputDir).forEach(file => {
    const extname = path.extname(file).toLowerCase(); // Get the file extension
    // Only process image files (PNG, JPG, JPEG)
    if (extname === '.png' || extname === '.jpg' || extname === '.jpeg') {
        const inputPath = path.join(inputDir, file); // Full path of the input file
        const outputDir = path.join(outputDirBase, path.basename(file, extname)); // Output directory based on the file name

        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Process the image
        processImage(inputPath, outputDir);
    }
});
