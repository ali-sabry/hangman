/*
	ProjectName: Hang Man Game,
	ProjectJob: Create Hang Man Man Draw Appended The Coming Data From Json.
*/ 	

(function hangManApp() {

		// Main Vars
		let letters       = 'abcdefghijklmnopqurstvwyxz';
		let lettersCont   = document.querySelector('.hang-man .letters');
		let category      = document.querySelector('.hang-man .category span') ;
		let gussesLetter  = document.querySelector('.letter-gusses');
		let draw          = document.querySelector('.draw');
		let start_btn     = document.getElementById('start-game-btn');
		let attempts      = 0;
		let getHint       = document.createElement('btn');
		let success_sound = new Audio('./sound/succses.wav');
		let fail_sound    = new Audio('./sound/fail.wav');
		let game_over     = new Audio('./sound/gameover.wav');
		let clapping_sound    = new Audio('./sound/clapping.wav');


		// Show The Instruction Info Only First Login To The Game 
		if(sessionStorage.getItem('state') === 'hidden') {
			document.querySelector('.instruction').remove();
		}

		// Start Button To Remove Instruction & Set The State To sessionStorage
		start_btn.onclick = ()=> {
			sessionStorage.state = 'hidden';
			document.querySelector('.instruction').remove();
		}

		// Generate Letters Spans
		letters.split('').forEach(letter => {
			// Create Span 
			let span = document.createElement('span');
			// Create Text Node Contains Letter
			let text = document.createTextNode(letter);

			// Set Class Name
			span.className = 'letter';

			// Append letters To Spans Then To Body
			span.appendChild(text);
			lettersCont.appendChild(span);
		});
				
		// Fetch Data From Json File
		fetch('js/data.json').then(result => result.json()).then(result => { // Set Main Vars

				// Vars To Get Random Key from Object
				const allPropsKeys   = Object.keys(result);
				const randomKeyNum   = Math.floor(Math.random() * allPropsKeys.length);
				const randomCategory = allPropsKeys[randomKeyNum];
				
				// Select Target Category Words Then Get Random Number
				const targetWords  = result[randomCategory];
				const randomValVal = Math.floor(Math.random() * targetWords.length);
				
				// Select Word From Target Category Words Then Get Word Length
				const targetWord   = targetWords[randomValVal];
				const wordLength   = targetWords.length;

				// Return All Vars 
				return { 
					allPropsKeys,
					randomKeyNum,
					randomCategory,
					targetWords,
					randomValVal,
					targetWord,
					wordLength
				}
		}).then(result => { // Handle The Data
			
			// Set The Current Category
			category.innerHTML = result.randomCategory;

			// Set Spans Append Gusses Word
			Array.from(result.targetWord).forEach((e) => {
				let span = document.createElement('span');
			
				if(e === ' ') {
					span.className = 'empty';
				}

				// Append Spans To Gusses Letters Container	
				gussesLetter.appendChild(span);
			});

			// Run Check Function & Finlize
			finlize(result.targetWord);

			// Return Json File Data
			return result;
		});
		
		// Function Finlize The Selected Word 
		function finlize(wordSelected) {
			// Convert Selected Word To Lower Case.
			let targetWord = wordSelected.toLowerCase();
			
			// Append Hint Button To Letters Panel
			lettersCont.appendChild(getHint);

			// On Clicked At Letter From Letters Panel
			document.addEventListener('click', (e) => {
				
				// Set Status Default As False.
				let status = false;

				// If Target Click On Document Is A Letter From Panel.
				if (e.target.className === "letter") {
						
					// Style Clicked Letter
					e.target.style.cssText = `pointer-events: none; background-color: #9e9e9e;`;
					
					// Get The Clicked Letter
					let letter = e.target.textContent.toLowerCase();
					
					// Check The Write Word By Map Function
					checkLetter(targetWord, letter, status);
				};

				// Function To Check The Right Letter
				function checkLetter(theWord, lt, stat) {

					// Loop The Word By Map To Check The Correct Letter.
					theWord.split('').map((ele, index) => {
						if(lt === ele) {
							// Change Status
							stat = true;

							// Run Success Sound
							success_sound.play();

							// Set The Clicked Letter To Gusses Span 
							gussesLetter.children[index].innerHTML = ele;

							// Hide The Hint Button
							 getHint.style.display = 'none';
						};
					});

					// If The Clicked Letter Is Wrong
					if(stat !== true) {
						// Incress Attempts Number
						attempts++; 

						// Run Success Sound
						fail_sound.play();

						// Add Wrong Class To Draw
						draw.classList.add(`wrong-${attempts}`); 
						
						// Generate Random Number & Letter
						let randNum       = Math.floor(Math.random() * theWord.length);
						let randLett      = theWord[randNum];

						// Show Game Over PoPUp If The Attempts Equal [8]
						if(attempts === 8) { 
							
							// Print Game Over POPUp
							finished('game-over', `Game Over The Target Word Is: <span>${targetWord}</span>`, 'Try Again', 'lose', 'try-again', game_over);

							// Reset Attempts To Zero
							attempts = 0; 
						} else if (attempts > 2 && theWord.length > 5) { // Create The Hint Button.
							
							// Set Button Text Content & Class Name.
							getHint.textContent = 'get hint';
							getHint.className = 'get-hint';
														
							// Show The Hint Button
							getHint.style.display = 'block';

							// The Hint Button On Click Action.
							getHint.onclick = ()=> {
								// Handel If The Hint Letter Is Already Selected
								Array.from(gussesLetter.children).forEach( (ele)=> {
									if(ele.textContent === randLett) {
										if(theWord.length !== randNum) {
											randNum++;
										} else {
											randNum--;
										};
									};
								});

								// Hide The Button
								getHint.remove();

								// Set The Letter To Result Gusess Board.
								gussesLetter.children[randNum].innerHTML = randLett;

								// Active Letter On From Letters Panel 
								Array.from(lettersCont.children).forEach( (e) => {
									e.textContent == randLett ? e.click() : null;
								});
							};
						};
					};

					// If The User Complete The Word Show PoPUP Congrats.
					let newWord = gussesLetter.textContent.toLowerCase();
					
					// Remove Space From The Word
					if(theWord.includes(' ')) {
						theWord = theWord.split(' ').join('');
					}
					
					// Check If The User End Word Correct
					if(newWord === theWord) { 
						// Show Congrats POPUP
						finished('finished', `Good Job The Word Is: <span>${targetWord}</span>`, 'Next Word', 'win', 'next-word', clapping_sound);
					};
				};

				// Function Create The PoPUP
				function finished(parentMsg, msgText, btnText, msgClass, btnClass, sound) {
					
					// Message & Button
					let parent  = document.createElement('div');
					let message = document.createElement('p');
					let btn     = document.createElement('button');

					// Set The Text Content
					message.innerHTML   = msgText;
					btn.textContent     = btnText;

					// Set The Classes Name
					parent.className  = parentMsg;
					message.className = msgClass;
					btn.className     = btnClass;

					// Appended Elements
					parent.appendChild(message);
					parent.appendChild(btn);
					lettersCont.prepend(parent);

					// Play The Sound
					sound.play();

					// Click The Button To Play Again
					btn.onclick = ()=> {
						window.location.reload();
					}
				};
			});
		};
}());

