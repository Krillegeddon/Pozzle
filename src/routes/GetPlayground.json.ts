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
        console.log(playingFieldX.coordinates);
        playingField2.coordinates = playingFieldX.coordinates;
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
    console.log("Coord to return");
    console.log(playingField2.coordinates);

    return {
        status: 200,
        body: JSON.stringify(playingField2)
    }
};
