const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source directory for textures
const inputDir = path.join(__dirname, 'src/textures/create/base');
// Output directory for the generated images and CSS file
const outputDirBase = path.join(__dirname, 'src/textures/create/cutted');

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirBase)) {
    fs.mkdirSync(outputDirBase);
}

// Define sections with their coordinates and dimensions
const sections = {
    "top_left": [80, 32, 16, 16],
    "top_right": [80, 16, 16, 16],
    "bottom_right": [64, 16, 16, 16],
    "bottom_left": [64, 32, 16, 16],
    "top": [32, 112, 16, 16],
    "bottom": [32, 96, 16, 16],
    "left": [32, 80, 16, 16],
    "right": [32, 64, 16, 16],
    "middle": [96, 96, 16, 16],
};

// Function to process each image
function processImage(inputPath, outputDir) {
    const imageName = path.basename(outputDir); // Name of the image (without extension)
    const cssLines = []; // Array to store CSS lines

    // Generate tasks for each section
    const tasks = Object.entries(sections).map(([name, [left, top, width, height]]) => {
        // Unique filename for the generated file
        const outputFileName = `${imageName}_${name}.png`;
        const outputFilePath = path.join(outputDir, outputFileName);

        return sharp(inputPath)
            .extract({ left, top, width, height }) // Extract the section
            .toFile(outputFilePath) // Save the cropped image
            .then(() => {
                // Default properties for each section
                let position = "top left";
                let repeat = "no-repeat";

                // Adjust properties based on the section type
                if (name === "top" || name === "bottom") {
                    repeat = "repeat-x";
                } else if (name === "left" || name === "right") {
                    repeat = "repeat-y";
                } else if (name === "middle") {
                    repeat = "repeat";
                }

                // Fix positions for the corners
                if (name === "top_right") {
                    position = "top right";  // Fix top_right and bottom_right position
                }
                else if (name === "top_left") {
                    position = "top left";
                }
                else if (name === "bottom_right") {
                    position = "bottom right";
                } else if (name === "bottom_left") {
                    position = "bottom left"; // Fix bottom_left position
                }else if (name === "bottom") {
                    position = "bottom left";
                }
                else if (name === "right") {
                    position = "top right";  // Fix right position
                } else if (name === "left") {
                    position = "top left";   // Fix left position
                } else if (name === "top") {
                    position = "top left";   // Fix top position
                }

                // Add the CSS line for this section
                cssLines.push(
                    `url('../textures/create/cutted/${imageName}/${outputFileName}') ${position} ${repeat}`
                );
            });
    });

    // Wait for all image processing tasks to complete
    Promise.all(tasks)
        .then(() => {
            // Final CSS output for the image
            const cssOutput = `
.bg-${imageName} {
    background:
            ${cssLines.join(',\n            ')} ;
    image-rendering: pixelated;
    background-size: 64px 64px;
}
            `.trim();

            // Append the CSS to the global CSS file
            const globalCssPath = path.join(outputDirBase, '../../../../src/templates/predefinedStyle.css');
            fs.appendFileSync(globalCssPath, `${cssOutput}\n\n`);
            console.log(`CSS generated for ${imageName} and appended to predefinedStyle.css`);
        })
        .catch(err => {
            console.error('Error processing images:', err);
        });
}

// Process all images in the source directory
fs.readdirSync(inputDir).forEach(file => {
    const extname = path.extname(file).toLowerCase(); // File extension
    // Process only PNG, JPG, or JPEG images
    if (extname === '.png' || extname === '.jpg' || extname === '.jpeg') {
        const inputPath = path.join(inputDir, file); // Full path of the source file
        const outputDir = path.join(outputDirBase, path.basename(file, extname)); // Output folder

        // Create the output directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Process the image
        processImage(inputPath, outputDir);
    }
});
