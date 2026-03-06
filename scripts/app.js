const getInputValue = (element) => {
    const input = document.getElementById(element);
    const inputValue = input.value;

    return inputValue;
}

document.getElementById('signInBtn').addEventListener('click', () => {
    const usernameValue = getInputValue('username');
    const passwordValue = getInputValue('password');

    if(usernameValue === 'admin' && passwordValue === 'admin123') {
        window.location.assign('dashboard.html')
    }
    else {
        alert('Incorrect username or password.');
        return;
    }
})