import { PlayingField, WordStatus, WordToCheck } from "$lib/PlayGround";
import { allWordsSE, allWordsSE_LetterCount } from "$lib/se";
import { allWordsEN_US } from "$lib/en_us";
import type { RequestHandler } from "@sveltejs/kit";

function getPointForLetter(letter: string, language: string) {
    if (language == "Svenska") {
        for (let i = 0; i < allWordsSE_LetterCount.length; i++) {
            if (allWordsSE_LetterCount[i].letter == letter) {
                return allWordsSE_LetterCount[i].point;
            }
        }
    }

}

function countPoints(word: string, language: string) {
    let point = 0;
    for (let i = 0; i < word.length; i++) {
        point += getPointForLetter(word.charAt(i), language);
    }
    return point;
}


export const POST: RequestHandler = async (event) => {
    var start = new Date().getTime();
    while (1 == 1) {
        if ((new Date().getTime() - start) > 200) {
            break;
        }
    }

    var req = await event.request.json();
    var word = req.word.toUpperCase();
    console.log("Checking - " + word);
    for (var i = 0; i < allWordsSE.length; i++) {
        if (allWordsSE[i].toUpperCase() == word) {
            var ret = new WordToCheck();
            ret.word = req.word;
            ret.points = countPoints(ret.word, req.language);
            ret.wordStatus = WordStatus.OK;
            console.log("Okay");

            return {
                status: 200,
                body: JSON.stringify(ret)
            }
        }
    }


    console.log("Fail");

    var ret = new WordToCheck();
    ret.word = req.word;
    ret.points = 0;
    ret.wordStatus = WordStatus.Fail;

    return {
        status: 200,
        body: JSON.stringify(ret)
    }
};
