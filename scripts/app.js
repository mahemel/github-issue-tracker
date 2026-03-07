
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

const processIssueType = (values) => {

    const labelsData = values.map(value => {
        const labelData = value.trim().toLowerCase();

        if(labelData === 'bug') {
            return `<div class="badge rounded-full text-xs bug"><img src="assets/bug-droied.svg" alt="" />${value}</div>` 
        } 
        else if (labelData === 'help wanted') {
            return `<div class="badge rounded-full text-xs help"><img src="assets/lifebuoy.svg" alt="" />${value}</div>`;
        }
        else if (labelData === 'enhancement') {
            return `<div class="badge rounded-full text-xs enhance"><img src="assets/sparkle.svg" alt="" />${value}</div>`;
        } 
        else if (labelData === 'good first issue') {
            return `<div class="badge rounded-full text-xs good-first">${value}</div>`;
        } 
        else {
            return `<div class="badge rounded-full text-xs issue-badge">${value}</div>`;
        }
    });

    const labelsHtml = labelsData.join('');

    return labelsHtml;
}

const displayIssues = (issues) => {
    const issueContainer = document.getElementById('issueContainer');
    issueContainer.innerHTML = '';

    const issueCounter = document.getElementById('issue-counter');
    issueCounter.innerText = issues.length;

    issues.forEach(issue => {
        let {id, title, description, status, priority, author, createdAt} = issue;


        const card = document.createElement('div');
        card.classList.add('card', 'bg-white', 'justify-between', 'shadow-md', `status-${status}`, 'rounded');

        card.setAttribute('onclick', `openDetail(${id})`)



        if(description.length > 63) {
            description = description.slice(0, 63) + '...';
        }
        
        const labelsHtml = processIssueType(issue.labels);


        card.innerHTML = `
            <div class="card-detail p-4 space-y-3">

                <div class="flex justify-between items-center">
                    <img src="assets/${(status === 'open') ? 'Open-Status.png"' : 'Closed- Status .png"'} alt="">

                    <div class="badge text-xs uppercase rounded-full priority priority-${priority}">${priority}</div>
                </div>

                <h3 class="font-semibold text-sm leading-tight text-black">${title}</h3>
                <p class="text-xs font-regular leading-tight text-dark-gray">${description}</p>

                <div class="flex flex-wrap gap-[2px] badges">
                    ${labelsHtml}
                </div>
            </div>

            <div class="author-info p-4 border-t border-light-gray flex flex-col gap-2">
                <p class="text-xs font-regular leading-none text-dark-gray">#${id} by ${author}</p>
                <p class="text-xs font-regular leading-none text-dark-gray">${createdAt}</p>
            </div>
        `;
        
        issueContainer.appendChild(card)
    });

    loadingIcon(false);
}

const loadingIcon = (status) => {
    if(status) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('issue-count-wrap').classList.add('hidden');
        document.getElementById('issueContainer').classList.add('hidden');
    } else {
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('issue-count-wrap').classList.remove('hidden');
        document.getElementById('issueContainer').classList.remove('hidden');
    }
}
const openDetail = (id) => {
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;

    fetch(url)
        .then(response => response.json())
        .then(json => displayIssueDetail(json.data))
    
}

const displayIssueDetail = (issuedetail) => {
    const {id, title, description,status, priority, author, createdAt} = issuedetail;

    const detailDiv = document.getElementById('issue-detail');
    detailDiv.innerHTML = '';

    
    const labelsHtml = processIssueType(issuedetail.labels);

    detailDiv.innerHTML = `
    

                <h3 class="font-semibold text-sm leading-tight text-black">${title}</h3>

                ${(status === 'open') ? 'Opened"' : 'Closed"'} ${author} ${createdAt}


                <div class="flex flex-wrap gap-1 badges">
                    ${labelsHtml}
                </div>

                <p class="text-xs font-regular leading-tight text-dark-gray">${description}</p>

                    <div class="badge text-xs uppercase rounded-full priority priority-${priority}">${priority}</div>
    `;
    document.getElementById('issue_modal').showModal();

}

loadAllIssues();