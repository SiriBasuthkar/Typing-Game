const quotes = [
	'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
	'There is nothing more deceptive than an obvious fact.',
	'I never make exceptions. An exception disproves the rule.',
	'What one man can invent another can discover.',
	'Nothing clears up a case so much as stating it to another person.',
	'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
  ];
  
  let words = [];
  let startTime = 0;
  
  const quoteElement = document.getElementById('quote');
  const messageElement = document.getElementById('message');
  const typedValueElement = document.getElementById('typed-value');
  const mistakesElement = document.getElementById('mistakes');
  
  // Start Game
  document.getElementById('start').addEventListener('click', () => {
	const quote = quotes[Math.floor(Math.random() * quotes.length)];
	words = quote.trim().split(/\s+/);
  
	// Display the quote
	quoteElement.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
	quoteElement.children[0].classList.add('highlight');
  
	// Reset UI
	typedValueElement.value = '';
	typedValueElement.disabled = false;
	typedValueElement.className = '';
	messageElement.innerText = '';
	mistakesElement.innerHTML = '';
	mistakesElement.classList.remove('visible');
	typedValueElement.focus();
  
	startTime = new Date().getTime();
  });
  
  // Submit Button
  document.getElementById('submitBtn').addEventListener('click', () => {
	const typedInput = typedValueElement.value.trim();
	submitScore(typedInput);
	typedValueElement.disabled = true;
  });
  
  // Score Calculation & Mistake Reporting
  function submitScore(typedInput) {
	const elapsedTime = new Date().getTime() - startTime;
	const timeInSeconds = (elapsedTime / 1000).toFixed(2);
  
	const typedWords = typedInput.split(/\s+/);
	let mistakes = 0;
	let mistakeHTML = '<h3>Mistakes:</h3><ul>';
  
	const maxLength = Math.max(words.length, typedWords.length);
  
	for (let i = 0; i < maxLength; i++) {
	  const expected = words[i];
	  const typed = typedWords[i];
  
	  if (!typed && expected) {
		mistakes++;
		mistakeHTML += `<li><strong>Missing word:</strong> "${expected}"</li>`;
	  } else if (!expected && typed) {
		mistakes++;
		mistakeHTML += `<li><strong>Extra word:</strong> "${typed}"</li>`;
	  } else if (expected !== typed) {
		mistakes++;
		mistakeHTML += `<li><strong>Expected:</strong> "${expected}" | <strong>Typed:</strong> "${typed}"</li>`;
	  }
	}
  
	if (mistakes === 0) {
	  mistakeHTML += '<li>None 🎉</li>';
	}
  
	mistakeHTML += '</ul>';
	mistakesElement.innerHTML = mistakeHTML;
	mistakesElement.classList.add('visible');
  
	const wpm = Math.round((typedWords.length / elapsedTime) * 60000);
	const accuracy = Math.max(0, Math.round(((words.length - mistakes) / words.length) * 100));
  
	messageElement.innerText = `✅ Time: ${timeInSeconds}s | ⏱ WPM: ${wpm} | 🎯 Accuracy: ${accuracy}%`;
  }
  