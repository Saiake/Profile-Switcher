callback: async (namedArgs, unnamedArgs) => {
    const args = unnamedArgs.trim();

    if (!args || isNaN(args)) {
        toastr.warning('Укажите номер профиля! Пример: /switch 2');
        return;
    }

    // Получаем CSRF-токен из мета-тега (он всегда есть в HTML SillyTavern)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    if (!csrfToken) {
        toastr.error('CSRF-токен не найден!');
        return;
    }

    try {
        const response = await fetch('/api/extensions/profile-switcher/switch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify({ profile: args })
        });

        const data = await response.json();

        if (response.ok) {
            toastr.success(data.message || `Переключено на профиль ${args}`);
        } else {
            toastr.error(data.error || 'Ошибка переключения');
        }
    } catch (e) {
        console.error('>>> PROFILE SWITCHER: Ошибка:', e);
        toastr.error('Ошибка соединения: ' + e.message);
    }
},
