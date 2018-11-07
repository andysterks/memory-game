window.onload = function() {
    let score = 0;
    let failedAttempts = 0;
    let gameTileImageSrcArray = [];
    let matchingTileSrcArray = [];
    let blankImageSrc = 'images/blank.jpeg';
    let animalImages = [
        'images/monkey.jpeg',
        'images/elephant.jpeg',
        'images/frog.jpeg'
    ];

    let gameTileElements = getImageTileElements(document);

    gameTileElements.forEach(function() {
        let possibleAnimalImages = animalImages.filter(function(animalImage) {
            return gameTileImageSrcArray .filter(gameTileSrc => gameTileSrc === animalImage).length < 2;
        });

        gameTileImageSrcArray .push(possibleAnimalImages[Math.floor(Math.random() * possibleAnimalImages.length)]);
    });

    gameTileElements.forEach(function(gameTileImageElement) {
        gameTileImageElement.addEventListener('click', function(){
            let clickedTileImagePath = getImagePath(gameTileImageElement, animalImages);

            let selectedImageTileIsMatched = matchingTileSrcArray.includes(clickedTileImagePath);
            if (!selectedImageTileIsMatched) {
                gameTileImageElement.src = gameTileImageSrcArray[gameTileElements.indexOf(gameTileImageElement)];

                let gamePiecesImageSrcArray = gameTileElements.map(function(piece) {
                    return getImagePath(piece, animalImages);
                });

                let activeGameTileImgElements = [];

                gamePiecesImageSrcArray.forEach(function(gameTileImgSrc){
                    let gameTileIsBlank = gameTileImgSrc.includes(blankImageSrc);
                    if (gameTileIsBlank) {
                        return;
                    }

                    if (matchingTileSrcArray.length === 0 || !matchingTileSrcArray.includes(gameTileImgSrc)) {
                        activeGameTileImgElements.push(gameTileImgSrc);
                    }
                });

                if (activeGameTileImgElements.length % 2 === 0){
                    const tilesAreMatching = activeGameTileImgElements[0] === activeGameTileImgElements[1];
                    if (tilesAreMatching) {
                        setTimeout(function(){
                            alert('Matching Pieces! YAYYYY!!!');
                        }, 100);
                        matchingTileSrcArray.push(activeGameTileImgElements[0]);
                        score += 1;
                        document.getElementById('score-value').innerHTML = score.toString();
                    } else {
                        setTimeout(function(){
                            alert('Pieces don\'t match...SORRY!!!');
                            gameTileElements.forEach(function(piece) {
                                if (!isAPreviouslyMatchedPiece(piece, matchingTileSrcArray)) {
                                    piece.src = blankImageSrc;
                                }
                            })
                        }, 100);
                        failedAttempts += 1;
                        document.getElementById('failed-attempts-value').innerHTML = failedAttempts.toString();
                    }
                }
            }
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