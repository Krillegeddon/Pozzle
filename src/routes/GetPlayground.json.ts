import { PlayingField } from "$lib/PlayGround";
import { allWordsSE } from "$lib/se";
import { allWordsEN_US } from "$lib/en_us";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
    var req = await event.request.json();
    console.log(req);

    let playingField2 = new PlayingField();
    if (req.playingField) {
        var playingFieldX = req.playingField;
        playingField2.coordinates = playingFieldX.coordinates;
        // All incoming coordinates are fixed:
        for (let i = 0; i < playingField2.coordinates.length; i++) {
            if (playingField2.coordinates[i].isFixed == false && playingField2.coordinates[i].letterIndex >= 0) {
                playingField2.coordinates[i].isFixed = true;
                playingField2.coordinates[i].letter = playingFieldX.givenLetters[playingField2.coordinates[i].letterIndex];
                playingField2.coordinates[i].letterIndex = -1;
            }
        }
        playingField2.givenLetters = playingFieldX.givenLetters;
        playingField2.givenLetterIndexes = playingFieldX.givenLetterIndexes;
        playingField2.minX = playingFieldX.minX;
        playingField2.maxX = playingFieldX.maxX;
        playingField2.minY = playingFieldX.minY;
        playingField2.maxY = playingFieldX.maxY;
        playingField2.usedIndexes = playingFieldX.usedIndexes;
        playingField2.language = playingFieldX.language;
    }
    playingField2.language = req.language;
    playingField2.givenLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    playingField2.givenLetterIndexes = [0, 1, 2, 3, 4, 5, 6];
    playingField2.usedIndexes = [];

    return {
        status: 200,
        body: JSON.stringify(playingField2)
    }
};
