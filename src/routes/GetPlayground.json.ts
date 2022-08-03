import { PlayingField } from "$lib/PlayGround";
import { allWordsSE } from "$lib/se";
import { allWordsEN_US } from "$lib/en_us";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
    let pf = new PlayingField();
    pf.givenLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    pf.givenLetterIndexes = [0, 1, 2, 3, 4, 5, 6];

    return {
        status: 200,
        body: JSON.stringify(pf)
    }
};
