document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalIncome = document.getElementById('total-income');
    const totalExpenses = document.getElementById('total-expenses');
    const balance = document.getElementById('balance');

    // Fetch and display transactions
    function fetchTransactions() {
        fetch('http://localhost:3000/api/transactions')
            .then(response => response.json())
            .then(transactions => {
                updateTransactionList(transactions);
                updateSummary(transactions);
            });
    }

    // Update transaction list
    function updateTransactionList(transactions) {
        transactionList.innerHTML = '';
        transactions.forEach(transaction => {
            const li = document.createElement('li');
            li.className = transaction.type;
            li.textContent = `${transaction.description}: $${transaction.amount} (${transaction.type})`;
            transactionList.appendChild(li);
        });
    }

    // Update summary
    function updateSummary(transactions) {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        totalIncome.textContent = `$${income.toFixed(2)}`;
        totalExpenses.textContent = `$${expenses.toFixed(2)}`;
        balance.textContent = `$${(income - expenses).toFixed(2)}`;
    }

    // Add new transaction
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const transaction = {
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            type: document.getElementById('type').value
        };
        console.log("transaction", transaction)
        fetch('http://localhost:3000/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transaction),
        })
        .then(response => response.json())
        .then(() => {
            fetchTransactions();
            form.reset();
        });
    });

    // Initial fetch
    fetchTransactions();
});