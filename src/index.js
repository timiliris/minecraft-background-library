const path = require('path');

module.exports = {
    // Chemin vers les styles prédéfinis
    predefinedStyles: path.resolve(__dirname, 'templates/predefinedStyles.css'),

    // Chemin vers les textures
    texturesPath: path.resolve(__dirname, '../textures'),

    // Exemple : Fonction pour copier les styles et textures dans un projet
    copyStylesAndTextures: function (outputDir) {
        const fs = require('fs-extra'); // Utilise fs-extra pour simplifier la copie
        const stylesPath = path.resolve(__dirname, 'templates/predefinedStyles.css');
        const texturesPath = path.resolve(__dirname, '../textures');

        // Copier les styles
        fs.copySync(stylesPath, path.join(outputDir, 'predefinedStyles.css'));

        // Copier les textures
        fs.copySync(texturesPath, path.join(outputDir, 'textures'));
    },
};
