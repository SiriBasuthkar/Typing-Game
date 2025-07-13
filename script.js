function getBestStats() {
	return {
		wpm: parseInt(localStorage.getItem('bestWPM') || 0),
		accuracy: parseInt(localStorage.getItem('bestAccuracy') || 0),
		time: parseFloat(localStorage.getItem('bestTime') || 9999)
	};
}

function updateBestStats(wpm, accuracy, time) {
	const best = getBestStats();

	if (wpm > best.wpm) localStorage.setItem('bestWPM', wpm);
	if (accuracy > best.accuracy) localStorage.setItem('bestAccuracy', accuracy);
	if (time < best.time) localStorage.setItem('bestTime', time);
}

function showBestStats() {
	const best = getBestStats();
	document.getElementById('best-stats').innerText =
		`🏆 Best WPM: ${best.wpm} | 🎯 Best Accuracy: ${best.accuracy}% | ⏱ Fastest Time: ${best.time}s`;
}


function saveScoreToHistory(wpm, accuracy, time) {
	let history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
	history.unshift({ wpm, accuracy, time }); // Add new score to beginning
	history = history.slice(0, 5); // Only keep last 5
	localStorage.setItem('scoreHistory', JSON.stringify(history));
	showScoreHistory();
}

function showScoreHistory() {
	let history = JSON.parse(localStorage.getItem('scoreHistory')) || [];
	let html = '<h3>📜 Last 5 Attempts:</h3><ul>';
	history.forEach(score => {
		html += `<li>⏱ ${score.time}s | 🎯 ${score.accuracy}% | 🚀 ${score.wpm} WPM</li>`;
	});
	html += '</ul>';
	document.getElementById('score-history').innerHTML = html;
}



document.getElementById('resetBtn').addEventListener('click', () => {
	localStorage.removeItem('bestWPM');
	localStorage.removeItem('bestAccuracy');
	localStorage.removeItem('bestTime');
	localStorage.removeItem('scoreHistory');
	showBestStats();
	showScoreHistory();
	alert('Best scores and history reset!');
});











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
let typedHistory = [];

const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const mistakesElement = document.getElementById('mistakes');

// ✅ Highlight current word by index
function highlightWord(index) {
	const spans = quoteElement.querySelectorAll('span');
	spans.forEach(span => span.classList.remove('highlight'));
	if (spans[index]) {
		spans[index].classList.add('highlight');
	}
}

// ✅ Start Game
document.getElementById('start').addEventListener('click', () => {
	const quote = quotes[Math.floor(Math.random() * quotes.length)];
	words = quote.trim().split(/\s+/);
	typedHistory = [];

	quoteElement.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');
	highlightWord(0);

	typedValueElement.value = '';
	typedValueElement.disabled = false;
	typedValueElement.className = '';
	messageElement.innerText = '';
	mistakesElement.innerHTML = '';
	mistakesElement.classList.remove('visible');
	typedValueElement.focus();
	startTime = new Date().getTime();
});

// ✅ Typing Input Handler
typedValueElement.addEventListener('input', () => {
	const currentWord = words[typedHistory.length];
	const typedText = typedValueElement.value;

	if (typedText.endsWith(' ')) {
		// Split typed text and track individual words
		const splitWords = typedText.trim().split(/\s+/);
		typedHistory = splitWords;
		highlightWord(typedHistory.length);
		typedValueElement.className = ''; // clear error state
	} else {
		// Live validation (optional)
		if (currentWord && !currentWord.startsWith(typedText.split(/\s+/).pop())) {
			typedValueElement.className = 'error';
		} else {
			typedValueElement.className = '';
		}
	}
});


// ✅ Submit Button Handler
document.getElementById('submitBtn').addEventListener('click', () => {
	const finalWord = typedValueElement.value.trim();
	if (finalWord) typedHistory.push(finalWord);

	submitScore(typedHistory);
	typedValueElement.disabled = true;
});

// ✅ Score & Mistake Report
function submitScore(typedWords) {
	const elapsedTime = new Date().getTime() - startTime;
	const timeInSeconds = (elapsedTime / 1000).toFixed(2);

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
	updateBestStats(wpm, accuracy, parseFloat(timeInSeconds));

const best = getBestStats();
document.getElementById('best-stats').innerText =
	`🏆 Best WPM: ${best.wpm} | 🎯 Best Accuracy: ${best.accuracy}% | ⏱ Fastest Time: ${best.time}s`;

	updateBestStats(wpm, accuracy, parseFloat(timeInSeconds));
showBestStats();
saveScoreToHistory(wpm, accuracy, timeInSeconds);


}


showBestStats();
showScoreHistory();
