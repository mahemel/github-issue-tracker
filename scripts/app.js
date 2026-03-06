
const removeActiveState = () => {
    const issueBtns = document.querySelectorAll('.issue-btns .btn');
    
    issueBtns.forEach(btn => {
        btn.classList.remove('active')
    })
}

const issueBtns = document.getElementById('issue-btns');
if(issueBtns) {
    issueBtns.addEventListener('click', (event) => {
        const targetBtn = event.target.closest('.btn');

        if(targetBtn) {
        const targetType = targetBtn.getAttribute('id');
            removeActiveState();

            targetBtn.classList.add('active');
            loadAllIssues(targetType);
        }
    });
}

const loadAllIssues = async () => {
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

    const issues = await fetch(url);
    const json = await issues.json();

    const data = json.data;

    displayIssues(data);
}

const displayIssues = (issues) => {
    const issueContainer = document.getElementById('issueContainer');
    issueContainer.innerHTML = '';

    const issueCounter = document.getElementById('issue-counter');
    issueCounter.innerText = issues.length;

    issues.forEach(issue => {
        const card = document.createElement('div');
        card.classList.add('border', 'shadow-sm');

        card.innerHTML = `
            <p>${issue.title}</p>
        `;
        
        issueContainer.appendChild(card)
    });
}

loadAllIssues();