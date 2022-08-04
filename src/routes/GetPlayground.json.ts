import { PlayingField } from "$lib/PlayGround";
//import { allWordsSE, allWordsSE_LetterCount } from "$lib/se";
import { allWordsEN_US } from "$lib/en_us";
import type { RequestHandler } from "@sveltejs/kit";
import fs from 'fs'
import { allWordsSE_LetterCount } from "$lib/se";

export class LetterCount {
    letter: string;
    count: number = 0;
    point: number = 0;
}

let letterCounts: Array<LetterCount> = new Array<LetterCount>();

function increaseLetter(letter: string) {
    for (var i = 0; i < letterCounts.length; i++) {
        if (letterCounts[i].letter == letter) {
            letterCounts[i].count++;
            return;
        }
    }
    let lc = new LetterCount();
    lc.letter = letter;
    lc.count = 1;
    letterCounts.push(lc);
}

function countLetters(word: string) {
    for (let i = 0; i < word.length; i++) {
        increaseLetter(word.charAt(i));
    }
}


function IsOkayWord(word: string, ignoredLetters: Array<string>) {
    for (var j = 0; j < ignoredLetters.length; j++) {
        if (word.indexOf(ignoredLetters[j]) >= 0) return false;
    }
    return true;
}


function SaveLang(inputFile: string, outputFile: string, className: string, ignoredLetters: Array<string>) {
    var allWordsStr = fs.readFileSync(inputFile, "utf-8").toString();
    var allWords = allWordsStr.split("\n");
    var bb = ""
    for (var i = 0; i < allWords.length; i++) {
        if (!IsOkayWord(allWords[i].trim(), ignoredLetters)) continue;
        if (bb != "") bb += ",\n";
        bb += "    \"" + allWords[i].trim() + "\"";
        countLetters(allWords[i].trim());
    }
    bb = "export let " + className + " = [" + bb;
    bb += "];\n\n";

    var sortedLetterCount = new Array<LetterCount>();

    while (sortedLetterCount.length != letterCounts.length) {
        var highest: LetterCount = new LetterCount();
        highest.count = 0;
        for (let i = 0; i < letterCounts.length; i++) {
            // If already sorted, then continue
            let letter = letterCounts[i].letter;
            if (isAlreadyInList(letter, sortedLetterCount)) continue;
            if (letterCounts[i].count > highest.count)
                highest = letterCounts[i]
        }
        sortedLetterCount.push(highest);
    }

    for (let i = 0; i < sortedLetterCount.length; i++) {
        if (i < 10) {
            sortedLetterCount[i].point = 1;
            continue;
        }
        if (i >= 10 && i < 15) {
            sortedLetterCount[i].point = 2;
            continue;
        }
        if (i >= 15 && i < 20) {
            sortedLetterCount[i].point = 4;
            continue;
        }

        if (i > sortedLetterCount.length - 4) {
            sortedLetterCount[i].point = 8;
            continue;
        }
        sortedLetterCount[i].point = 6;
    }



    bb += "export let " + className + "_LetterCount = " + JSON.stringify(sortedLetterCount) + ";";

    fs.writeFileSync(outputFile, bb);
}


function isAlreadyInList(letter: string, list: Array<LetterCount>): boolean {
    for (let j = 0; j < list.length; j++) {
        if (list[j].letter == letter) return true;
    }
    return false;
}


function getRandomString(letters: Array<LetterCount>): string {
    var ret = "";
    for (let i = 0; i < letters.length; i++) {
        for (let j = 0; j < (10 - letters[i].point); j++) {
            ret += letters[i].letter;
        }
    }
    return ret;
}


export const POST: RequestHandler = async (event) => {
    var req = await event.request.json();
    // SaveLang("C:\\_Git\\Pozzle\\src\\lib\\se_utf8.txt", "C:\\_Git\\Pozzle\\src\\lib\\se.ts", "allWordsSE",
    //     ["-", "é", "è", "q", "w"]);

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

    var randomString = getRandomString(allWordsSE_LetterCount);
    playingField2.givenLetters = [];
    playingField2.givenLetterIndexes = [];
    for (let i = 0; i < 10; i++) {
        let index = Math.floor(Math.random() * (randomString.length));
        playingField2.givenLetters.push(randomString.charAt(index).toUpperCase());
        playingField2.givenLetterIndexes.push(i);
    }

    // playingField2.givenLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    // playingField2.givenLetterIndexes = [0, 1, 2, 3, 4, 5, 6];
    playingField2.usedIndexes = [];

    return {
        status: 200,
        body: JSON.stringify(playingField2)
    }
};
