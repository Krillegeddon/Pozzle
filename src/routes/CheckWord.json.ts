import { PlayingField, WordStatus, WordToCheck } from "$lib/PlayGround";
//import { allWordsSE, allWordsSE_LetterCount } from "$lib/se";
import { allWordsEN_US } from "$lib/en_us";
import type { RequestHandler } from "@sveltejs/kit";



export const POST: RequestHandler = async (event) => {
    // var start = new Date().getTime();
    // while (1 == 1) {
    //     if ((new Date().getTime() - start) > 500) {
    //         break;
    //     }
    // }

    var req = await event.request.json();
    console.log(req);
    var ret = new WordToCheck();
    ret.word = req.word;
    ret.points = 99;
    ret.wordStatus = WordStatus.OK;

    return {
        status: 200,
        body: JSON.stringify(ret)
    }
};
