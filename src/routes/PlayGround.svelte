<script lang="ts">
	import { BrickType, PlayingField, WordStatus, WordToCheck } from '$lib/PlayGround';
	import { page } from '$app/stores';
	import { browser, dev, prerendering } from '$app/env';
	import { onMount } from 'svelte';
	var playingField: PlayingField;
	var showHelp = false;
	var errorMessage = 'Loading2';
	var language: string = '';
	var checkedWords = new Array<WordToCheck>();

	async function FetchCheckWord(lang: string, word: string) {
		try {
			var url = $page.url.href + 'CheckWord.json';
			const f = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({ word: word, language: lang }),
				headers: {}
			});

			let r = await f.json();
			for (var i = 0; i < checkedWords.length; i++) {
				if (checkedWords[i].word == word) {
					checkedWords[i].wordStatus = r.wordStatus;
					checkedWords[i].points = r.points;
				}
			}
			console.log('FetchCheckWord');
			console.log(r);
		} catch (e) {
			console.log(e);
		}
	}

	// async function getWordStatus(word: string): Promise<WordToCheck> {
	// 	var pp = FetchCheckWord(language, word);
	// 	console.log(pp);
	// 	return pp;
	// }

	// function getWordStatus(word: string): WordToCheck {
	// }

	async function Fetch(lang: string): Promise<any> {
		try {
			var url = $page.url.href + 'GetPlayground.json';
			const f = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({ playingField: playingField, language: language }),
				headers: {}
			});

			let r = await f.json();
			return r;
		} catch (e) {
			return 'fel';
		}
	}

	async function GetGrid(lang: string) {
		if (!language) return; // language = 'English US';
		localStorage.setItem('Language', lang);

		if (lang == 'Svenska') {
		}

		if (lang == 'English US') {
		}

		//var r = GetPlayground();
		let playingFieldX = await Fetch(lang);

		let playingField2 = new PlayingField();
		playingField2.coordinates = playingFieldX.coordinates;
		playingField2.givenLetters = playingFieldX.givenLetters;
		playingField2.givenLetterIndexes = playingFieldX.givenLetterIndexes;
		playingField2.minX = playingFieldX.minX;
		playingField2.maxX = playingFieldX.maxX;
		playingField2.minY = playingFieldX.minY;
		playingField2.maxY = playingFieldX.maxY;
		playingField2.usedIndexes = playingFieldX.usedIndexes;
		playingField2.language = playingFieldX.language;
		playingField2.normalize();

		playingField = playingField2;
		columns = playingField.getXCoordArray();
		rows = playingField.getYCoordArray();
		checkedWords = [];
		errorMessage = '';
	}

	function submit() {
		console.log('Submitting!');
		GetGrid(playingField.language);
	}

	$: GetGrid(language);

	onMount(async () => {
		if (browser) {
			if (!language && localStorage) {
				let l = localStorage.getItem('Language');
				if (!l) {
					language = 'Svenska';
				} else {
					language = l;
				}
			}
			//GetGrid(language);
		}
	});

	var columns = new Array<number>();
	var rows = new Array<number>();

	function isSet(x: number, y: number) {
		if (isFixed(x, y)) return false;
		var coord = playingField.getCoordinate(x, y);
		if (!coord) return false;
		if (coord.isFixed || coord.letterIndex < 0) return false;
		return true;
	}
	function isPossible(x: number, y: number) {
		if (playingField.coordinates.length == 0 && x == 0 && y == 0) return true;

		if (isSet(x, y)) return false;
		if (isFixed(x, y)) return false;

		// We haven't specified anything yet... check if we've got a letter N/W/S/E of us...
		if (
			playingField.getCoordinate(x - 1, y) ||
			playingField.getCoordinate(x + 1, y) ||
			playingField.getCoordinate(x, y - 1) ||
			playingField.getCoordinate(x, y + 1)
		) {
			return true;
		}

		return false;
	}
	function isFixed(x: number, y: number) {
		var coord = playingField.getCoordinate(x, y);
		if (!coord) return false;
		if (coord.isFixed || coord.letter) return true;
		return false;
	}
	function handleKeydown(event: any) {}

	function isWordAdded(word: string): boolean {
		for (var i = 0; i < checkedWords.length; i++) {
			if (checkedWords[i].word == word) return true;
		}
		return false;
	}
	function setLetterHere(x: number, y: number) {
		if (isFixed(x, y)) return;
		playingField.setLetterIndex(x, y, selectedIndex);
		selectedIndex = -1;
		playingField.normalize();
		playingField = playingField;
		columns = playingField.getXCoordArray();
		rows = playingField.getYCoordArray();
		var words = playingField.getWordsForRound();
		for (var i = 0; i < words.length; i++) {
			if (isWordAdded(words[i])) continue;
			var wc = new WordToCheck();
			wc.word = words[i];
			wc.points = 0;
			wc.wordStatus = WordStatus.Pending;
			checkedWords = [...checkedWords, wc];
			FetchCheckWord(language, wc.word);
		}
	}

	function checkStatusOnWord(cw: Array<WordToCheck>, word: string): WordToCheck {
		for (var i = 0; i < cw.length; i++) {
			if (cw[i].word == word) {
				return cw[i];
			}
		}
		return null;
	}

	function setSelectedLetter(letterIndex: number) {
		if (playingField.isUsedLetter(letterIndex)) return;
		selectedIndex = letterIndex;
	}

	let selectedIndex: number = -1;
</script>

<svelte:window on:keydown={handleKeydown} />

{#if !errorMessage}
	<!-- <h1>columns.length: {columns.length}, rows.length: {rows.length}</h1> -->
	<!-- <input type="text" bind:value={grid.selectedLetters} /> -->
	<table style="width:100%">
		<tr>
			<td align="center" style="align:center;">
				<h1>
					POZZLE <svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-patch-question"
						viewBox="0 0 16 16"
						style="cursor:pointer"
						on:click={() => (showHelp = !showHelp)}
					>
						<path
							d="M8.05 9.6c.336 0 .504-.24.554-.627.04-.534.198-.815.847-1.26.673-.475 1.049-1.09 1.049-1.986 0-1.325-.92-2.227-2.262-2.227-1.02 0-1.792.492-2.1 1.29A1.71 1.71 0 0 0 6 5.48c0 .393.203.64.545.64.272 0 .455-.147.564-.51.158-.592.525-.915 1.074-.915.61 0 1.03.446 1.03 1.084 0 .563-.208.885-.822 1.325-.619.433-.926.914-.926 1.64v.111c0 .428.208.745.585.745z"
						/>
						<path
							d="m10.273 2.513-.921-.944.715-.698.622.637.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944 1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92.016-1.32a1.89 1.89 0 0 0-1.912-1.911l-1.318.016z"
						/>
						<path d="M7.001 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0z" />
					</svg>
					<br />
					<select bind:value={language}>
						<option value={'Svenska'}>Svenska</option>
						<!-- <option value={'English US'}>English US</option> -->
					</select>
				</h1>
				<div class:hidden={!showHelp}>
					{#if language == 'Svenska'}
						F??r varje omg??ng f??r du X antal bokst??ver.<br />
						Markera en bokstav som du vill placera genom att trycka p?? den l??ngst ner<br />
						Markera sedan var du vill placera bokstaven<br />
						F??r varje bokstav som placeras, s?? finns m??jlighet att placera runtomkring denna bokstav.<br
						/>
						N??r du inte kommer p?? fler ord eller att tiden tar slut, skickas omg??ngen in.<br />
						Du matchas mot din motst??ndare. Den spelare som f??r flest po??ng under omg??ngen<br />
						f??r beh??lla sina bokst??ver p?? spelplanen (f??rloraren f??r allts?? motst??ndarens ord)<br />
						Vinnaren erh??ller ??ven 20 extrapo??ng denna omg??ng.<br />
						Spelet varar 5 omg??ngar. Den med mest po??ng n??r spelet ??r slut ??r vinnaren!<br /><br />
						Ha s?? skoj!<br />
						<br />
					{/if}
					{#if language == 'English US'}
						TBD!<br />
						Have fun!<br />
						<br />
					{/if}
				</div>

				<table>
					{#each rows as row}
						<tr>
							{#each columns as column}
								<td
									class:letterbox={isPossible(column, row)}
									class:letterbox-set={isSet(column, row)}
									class:letterbox-fixed={isFixed(column, row)}
									on:click={() => setLetterHere(column, row)}
								>
									{#if isSet(column, row)}
										{playingField.givenLetters[playingField.getCoordinate(column, row).letterIndex]}
									{/if}
									{#if isFixed(column, row)}
										{playingField.getCoordinate(column, row).letter}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</table>
				<div style="width:300px;margin-top:20px;">
					{#each playingField.givenLetterIndexes as givenLetterIndex}
						<div
							style="cursor:pointer"
							on:click={() => setSelectedLetter(givenLetterIndex)}
							class="letterbox-keyboard"
							class:letterbox-selected={selectedIndex == givenLetterIndex}
							class:letterbox-used={playingField.isUsedLetter(givenLetterIndex)}
							class:letterbox-selectable={selectedIndex != givenLetterIndex &&
								!playingField.isUsedLetter(givenLetterIndex)}
						>
							{playingField.givenLetters[givenLetterIndex]}
						</div>
					{/each}
				</div>
				<div style="width:300px;margin-top:20px;">
					<button on:click={submit}>Submit</button>
				</div>
				<div style="width:300px;margin-top:20px;">
					{#each playingField.getWordsForRound() as word}
						<div
							class:word-ok={checkStatusOnWord(checkedWords, word).wordStatus == WordStatus.OK}
							class:word-fail={checkStatusOnWord(checkedWords, word).wordStatus == WordStatus.Fail}
						>
							{word}, {checkStatusOnWord(checkedWords, word).points}
						</div>
					{/each}
				</div>
			</td>
		</tr>
	</table>
{:else}
	<span color="yellow;">{errorMessage}</span>
{/if}

<style>
	.hidden {
		display: none;
	}
	body {
		font-family: sans-serif;
		background-color: #111111;
		color: white;
	}
	* {
		color: white;
		font-family: sans-serif;
		background-color: #111111;
	}
	.word-ok {
		color: green;
	}
	.word-fail {
		color: red;
	}
	.letterbox {
		border: 1px #555555 solid;
		height: 20px;
		width: 20px;
		font-size: 18px;
	}
	.letterbox-set {
		border: 1px #555555 solid;
		color: white;
		background-color: green;
		text-align: center;
	}
	.letterbox-fixed {
		border: 1px #555555 solid;
		color: white;
		text-align: center;
	}
	.letterbox-selected {
		border: 1px #555555 solid;
		color: white;
		background-color: darkblue;
		height: 20px;
		width: 20px;
		text-align: center;
	}
	.letterbox-used {
		border: 1px #555555 solid;
		color: white;
		height: 20px;
		width: 20px;
		text-align: center;
	}
	.letterbox-selectable {
		background-color: green;
	}
	.letterbox-keyboard {
		display: inline-block;
		border: 1px #555555 solid;
		height: 30px;
		width: 30px;
		text-align: center;
		margin: 2px;
		font-size: 30px;
		color: white;
	}
</style>
