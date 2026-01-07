console.log('>>> SWITCHER: Файл скрипта загружен браузером!');

(async function () {
    const waitForSillyTavern = async () => {
        while (!window.SillyTavern || !SillyTavern.getContext) {
            console.log('>>> SWITCHER: Ждем загрузки ядра SillyTavern...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return SillyTavern.getContext();
    };

    try {
        const context = await waitForSillyTavern();
        console.log('>>> SWITCHER: Ядро получено, регистрируем команду...');

        const { SlashCommandParser, SlashCommand } = context.slashCommand;

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
                    await fetch(url);
                    toastr.success('Переключаюсь на профиль ' + args);
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
    }
})();
