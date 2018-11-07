window.onload = function() {
    let gameState = {
        score: 0,
        failedAttempts: 0,
        gameTileImageSrcArray: [],
        matchingTileSrcArray: []
    };

    const constants = {
        blankImageSrc: 'images/blank.jpeg',
        animalImages: [
            'images/monkey.jpeg',
            'images/elephant.jpeg',
            'images/frog.jpeg'
        ]
    };

    let gameTileElements = getImageTileElements(document);

    gameState.gameTileImageSrcArray = [];

    gameTileElements.forEach(function() {
        let possibleAnimalImages = constants.animalImages.filter(function(animalImage) {
            return gameState.gameTileImageSrcArray .filter(gameTileSrc => gameTileSrc === animalImage).length < 2;
        });

        gameState.gameTileImageSrcArray .push(possibleAnimalImages[Math.floor(Math.random() * possibleAnimalImages.length)]);
    });

    gameTileElements.forEach(function(gameTileImageElement) {
        gameTileImageElement.addEventListener('click', function(){
            let clickedTileImagePath = getImagePath(gameTileImageElement, constants.animalImages);

            let selectedImageTileIsMatched = gameState.matchingTileSrcArray.includes(clickedTileImagePath);
            if (selectedImageTileIsMatched) { return; }

            gameTileImageElement.src = gameState.gameTileImageSrcArray[gameTileElements.indexOf(gameTileImageElement)];

            let gamePiecesImageSrcArray = gameTileElements.map(function(piece) {
                return getImagePath(piece, constants.animalImages);
            });



            let activeGameTileImgElements = [];

            gamePiecesImageSrcArray.forEach(function(gameTileImgSrc){
                let gameTileIsBlank = gameTileImgSrc.includes(constants.blankImageSrc);
                if (gameTileIsBlank) {
                    return;
                }

                if (gameState.matchingTileSrcArray.length === 0 || !gameState.matchingTileSrcArray.includes(gameTileImgSrc)) {
                    activeGameTileImgElements.push(gameTileImgSrc);
                }
            });


            if (activeGameTileImgElements.length % 2 !== 0) { return; }

            const tilesAreMatching = activeGameTileImgElements[0] === activeGameTileImgElements[1];
            if (tilesAreMatching) {
                setTimeout(function(){
                    alert('Matching Pieces! YAYYYY!!!');
                }, 100);
                gameState.matchingTileSrcArray.push(activeGameTileImgElements[0]);
                gameState.score += 1;
                document.getElementById('score-value').innerHTML = gameState.score.toString();
                return;
            }

            setTimeout(function(){
                alert('Pieces don\'t match...SORRY!!!');
                gameTileElements.forEach(function(piece) {
                    if (!isAPreviouslyMatchedPiece(piece, gameState.matchingTileSrcArray)) {
                        piece.src = constants.blankImageSrc;
                    }
                })
            }, 100);
            gameState.failedAttempts += 1;
            document.getElementById('failed-attempts-value').innerHTML = gameState.failedAttempts.toString();

        });
    });
};

function getImageTileElements(dom){
    let gameTileElements = [];

    for(let gameTileElement of dom.getElementsByClassName('game-tile-image')){
        gameTileElements.push(gameTileElement);
    }

    return gameTileElements;
}

function getActiveGamePieces(gamePieces, matchedPieces, blankImageSrc) {
    let activePieces = [];

    gamePieces.forEach(function(gameTileImgSrc){
        let gameTileIsBlank = gameTileImgSrc.includes(blankImageSrc);
        if (gameTileIsBlank) {
            return;
        }

        if (matchedPieces.length === 0 || !matchedPieces.includes(gameTileImgSrc)) {
            activePieces.push(gameTileImgSrc);
        }
    });

    return activePieces;
}

function getImagePath(imgElement, animalImages) {
    let relativeImgSrc = imgElement.src;

    animalImages.forEach(function(animalImage){
        if (imgElement.src.includes(animalImage)){
            relativeImgSrc = animalImage;
        }
    });

    return relativeImgSrc;
}

function isAPreviouslyMatchedPiece(gamePiece, matchedGamePieces) {
    let isPreviouslyMatchedPiece = false;

    matchedGamePieces.forEach(function(matchedPiece) {
        if (gamePiece.src.includes(matchedPiece)) {
            isPreviouslyMatchedPiece = true;
        }
    });

    return isPreviouslyMatchedPiece;
}