document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entry-form');
    const entryList = document.getElementById('entry-list');
    const totalIncomeElem = document.getElementById('total-income');
    const totalExpensesElem = document.getElementById('total-expenses');
    const netBalanceElem = document.getElementById('net-balance');

    let entries = JSON.parse(localStorage.getItem('entries')) || [];
    let filter = 'all';

    function saveEntries() {
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    function renderEntries() {
        entryList.innerHTML = '';
        let filteredEntries = entries.filter(entry => filter === 'all' || entry.type === filter);
        filteredEntries.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${entry.description} - ₹${entry.amount.toFixed(2)}</span>
                <div>
                    <button class="edit" onclick="editEntry(${index})">Edit</button>
                    <button class="delete" onclick="deleteEntry(${index})">Delete</button>
                </div>
            `;
            entryList.appendChild(li);
        });
        updateSummary();
    }

    function updateSummary() {
        const income = entries.filter(e => e.type === 'income').reduce((total, entry) => total + entry.amount, 0);
        const expenses = entries.filter(e => e.type === 'expense').reduce((total, entry) => total + entry.amount, 0);
        const balance = income - expenses;

        totalIncomeElem.textContent = `₹${income.toFixed(2)}`;
        totalExpensesElem.textContent = `₹${expenses.toFixed(2)}`;
        netBalanceElem.textContent = `₹${balance.toFixed(2)}`;
    }

    window.editEntry = function (index) {
        const entry = entries[index];
        document.getElementById('description').value = entry.description;
        document.getElementById('amount').value = entry.amount;
        document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;
        form.dataset.editIndex = index;
    };

    window.deleteEntry = function (index) {
        entries.splice(index, 1);
        saveEntries();
        renderEntries();
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.querySelector('input[name="type"]:checked').value;
        const editIndex = form.dataset.editIndex;

        if (editIndex !== undefined) {
            entries[editIndex] = { description, amount, type };
            delete form.dataset.editIndex;
        } else {
            entries.push({ description, amount, type });
        }

        saveEntries();
        renderEntries();
        form.reset();
    });

    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            filter = e.target.value;
            renderEntries();
        });
    });

    renderEntries();
});
