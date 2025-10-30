// Load keywords from storage when popup opens
document.addEventListener('DOMContentLoaded', () => {
  loadKeywords();

  document.getElementById('addKeyword').addEventListener('click', addKeywordRow);
  document.getElementById('saveKeywords').addEventListener('click', saveKeywords);
});

function loadKeywords() {
  chrome.storage.sync.get(['keywords'], (result) => {
    const keywords = result.keywords || {
      "personal-password": "123456",
      "personal-email": "example@gmail.com",
      "api_key": "example_apikey"
    }; // if there are not keywords set to defaults

    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = '';

    for (const [key, value] of Object.entries(keywords)) {
      addKeywordRow(key, value);
    }
  });
}

function addKeywordRow(key, value) {
  const keywordsList = document.getElementById('keywordsList');

  const keywordItem = document.createElement('div');
  keywordItem.className = 'keyword-item';

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.placeholder = 'Label (e.g., personal-password)';
  keyInput.value = key;
  keyInput.className = 'keyword-key';

  const valueInput = document.createElement('input');
  //valueInput.type = 'password';
  valueInput.placeholder = 'Sensitive value';
  valueInput.value = value;
  valueInput.className = 'keyword-value';

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'X';
  removeBtn.addEventListener('click', () => {
    keywordItem.remove();
  });

  keywordItem.appendChild(keyInput);
  keywordItem.appendChild(valueInput);
  keywordItem.appendChild(removeBtn);

  keywordsList.appendChild(keywordItem);
}

function saveKeywords() {
  const keywordItems = document.querySelectorAll('.keyword-item');
  const keywords = {};

  keywordItems.forEach(item => {
    const key = item.querySelector('.keyword-key').value.trim();
    const value = item.querySelector('.keyword-value').value.trim();

    if (key && value) {
      keywords[key] = value;
    }
  });



  chrome.storage.sync.set({ keywords: keywords }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Keywords saved successfully!';
    status.className = 'success';
    status.style.display = 'block';
  });
}
