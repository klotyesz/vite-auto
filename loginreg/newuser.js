window.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('form'); // Nincs action, ezért így keressük
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('emailaddress').value.trim();
            const password = document.getElementById('password').value.trim();
            const rePassword = document.getElementById('rePassword').value.trim();

            if (password !== rePassword) {
                alert('A két jelszó nem egyezik!');
                return;
            }

            try {
                const response = await fetch('https://retoolapi.dev/FCQu2e/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                });

                if (!response.ok) throw new Error('Hiba történt a regisztráció során.');

                alert('Sikeres regisztráció!');
                window.location.href = './login.html';
            } catch (error) {
                console.error(error);
                alert('Hiba történt a regisztráció során.');
            }
        });
    }
});
