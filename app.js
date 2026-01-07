import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';

const { eventSource, event_types } = SillyTavern.getContext();

eventSource.on(event_types.APP_READY, () => {
    try {
        console.log('>>> PROFILE SWITCHER: Регистрируем команду...');

        const switchProfileCommand = SlashCommand.fromProps({
            name: 'switch',
            callback: async (namedArgs, unnamedArgs) => {
                const args = unnamedArgs.trim();

                if (!args || isNaN(args)) {
                    toastr.warning('Укажите номер профиля! Пример: /switch 2');
                    return;
                }

                // Получаем CSRF-токен из мета-тега страницы
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

                if (!csrfToken) {
                    toastr.error('Не найден CSRF-токен! Перезагрузите страницу.');
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
                        toastr.error(data.error || 'Ошибка переключения профиля');
                    }
                } catch (e) {
                    console.error('>>> PROFILE SWITCHER: Ошибка сети:', e);
                    toastr.error('Ошибка соединения: ' + e.message);
                }
            },
            helpString: 'Переключает на указанный профиль Gemini. Пример: /switch 2',
        });

        SlashCommandParser.addCommandObject(switchProfileCommand);
        console.log('>>> PROFILE SWITCHER: Команда /switch успешно зарегистрирована!');
        toastr.info('Profile Switcher готов к работе');
    } catch (e) {
        console.error('>>> PROFILE SWITCHER: КРИТИЧЕСКАЯ ОШИБКА:', e);
    }
});
