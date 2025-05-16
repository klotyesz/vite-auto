window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form'); // Nincs action="login", így egyszerűen a formot célozzuk
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            try {
                const response = await fetch('https://retoolapi.dev/FCQu2e/user');
                if (!response.ok) throw new Error('Nem sikerült betölteni a felhasználói adatokat.');

                const users = await response.json();

                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    alert('Sikeres bejelentkezés!');
                    window.location.href = './welcome.html';
                } else {
                    alert('Hibás felhasználónév vagy jelszó!');
                }
            } catch (error) {
                console.error(error);
                alert('Hiba történt a bejelentkezés során.');
            }
        });
    }
});
