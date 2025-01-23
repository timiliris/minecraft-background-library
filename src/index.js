const path = require('path');

module.exports = {
    predefinedStyles: path.resolve(__dirname, 'templates/predefinedStyles.css'),

    texturesPath: path.resolve(__dirname, '../textures'),

    copyStylesAndTextures: function (outputDir) {
        const fs = require('fs-extra');
        const stylesPath = path.resolve(__dirname, 'templates/predefinedStyles.css');
        const texturesPath = path.resolve(__dirname, '../textures');
        fs.copySync(stylesPath, path.join(outputDir, 'predefinedStyles.css'));
        fs.copySync(texturesPath, path.join(outputDir, 'textures'));
    },
};
