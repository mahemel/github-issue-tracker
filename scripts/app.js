
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

const loadAllIssues = async (type = 'all') => {

    loadingIcon(true);
    const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';

    const issues = await fetch(url);
    const json = await issues.json();

    const data = json.data;

    if(type === 'all') {
        displayIssues(data);
    }
    else {
        const filteredData = data.filter(item => item.status === type);

        displayIssues(filteredData);
    }
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

    loadingIcon(false);
}

const loadingIcon = (status) => {
    if(status) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('issue-counter').classList.add('hidden');
        document.getElementById('issueContainer').classList.add('hidden');
    } else {
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('issue-counter').classList.remove('hidden');
        document.getElementById('issueContainer').classList.remove('hidden');

    }
}

loadAllIssues();