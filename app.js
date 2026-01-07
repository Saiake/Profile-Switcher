(async function() {
    try {
        while (typeof SlashCommandParser === 'undefined' || typeof SlashCommand === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('>>> SWITCHER: Ядро получено, регистрируем команду...');

        const switchProfileCommand = SlashCommand.fromProps({
            name: 'switch',
            callback: async (namedArgs, unnamedArgs) => {
                const args = unnamedArgs.join(' ').trim();

                if (!args) {
                    toastr.warning('Укажите номер профиля! Пример: /switch 2');
                    return;
                }

                const url = `http://localhost:9000/hooks/switch?id=${args}`;
                console.log('>>> SWITCHER: Отправляем запрос на', url);

                try {
                    const response = await fetch(url);
                    
                    if (response.ok) {
                        toastr.success('Переключаюсь на профиль ' + args);
                    } else {
                        throw new Error('Сервер вернул ошибку: ' + response.status);
                    }
                } catch (e) {
                    console.error('>>> SWITCHER: Ошибка сети:', e);
                    toastr.error('Ошибка соединения: ' + e.message);
                }
            },
            helpString: 'Переключает на указанный профиль. Пример: /switch 2',
        });

        SlashCommandParser.addCommandObject(switchProfileCommand);
        console.log('>>> SWITCHER: Команда /switch успешно зарегистрирована! (Ищите её в чате)');
        toastr.info('Profile Switcher готов к работе');

    } catch (e) {
        console.error('>>> SWITCHER: КРИТИЧЕСКАЯ ОШИБКА:', e);
        toastr.error('Ошибка расширения Switcher');
    }
})();
