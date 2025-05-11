async function processImage() {
  const input = document.getElementById('imageInput');
  if (!input.files.length) return;

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = async () => {
    // Mostra loader
    document.getElementById('ocrResult').textContent = '⏳ Scansione in corso...';

    try {
      const result = await Tesseract.recognize(reader.result, 'ita', {
        langPath: 'https://tessdata.projectnaptha.com/4.0.0_best/',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@4.0.2/tesseract-core.wasm.js',
        logger: m => console.log(m)
      });

      const text = result.data.text;
      document.getElementById('ocrResult').textContent = text;
      //richiamo FUNZIONE PER ESTRARRE DALLO SCONTRINO L'IMPORTO
      const amount = extractAmount(text);
      if (amount) saveExpense(amount);
      else alert("⚠️ Impossibile trovare l'importo nello scontrino.");
    } catch (error) {
      document.getElementById('ocrResult').textContent = 'Errore nella scansione.';
      console.error(error);
    }
  };

  reader.readAsDataURL(file);
}
//funzione per estrarre l'importo dallo scontrino tramite regex
function extractAmount(text) {
  // Linee comuni che precedono l'importo
  const patterns = [
    /importo\s*pagato\s*[:\-]?\s*(\d+[,.]?\d{0,2})/i,
    /tot(?:ale)?\s*(?:complessivo)?\s*[:\-]?\s*(\d+[,.]?\d{0,2})/i,
    /pag\.?contante\s*[:\-]?\s*(\d+[,.]?\d{0,2})/i,
    /tot\.?\s*[:\-]?\s*(\d+[,.]?\d{0,2})/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
  }

  return null; // Nessun importo trovato
}

function saveExpense(amount) {
  const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  expenses.push({ date: new Date().toISOString(), amount });
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
}

function renderExpenses() {
  const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  const list = document.getElementById('expenseList');
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  list.innerHTML = '';
  expenses.forEach(e => {
    const li = document.createElement('li');
    li.textContent = `${new Date(e.date).toLocaleDateString()}: ${e.amount.toFixed(2)} €`;
    list.appendChild(li);
  });

  document.getElementById('total').textContent = total.toFixed(2) + ' €';
}

// inizializza al load
renderExpenses();
