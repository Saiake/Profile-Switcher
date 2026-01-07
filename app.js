import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';

const { eventSource, event_types } = SillyTavern.getContext();

eventSource.on(event_types.APP_READY, () => {
    try {
        console.log('>>> PROFILE SWITCHER: Регистрируем команду...');

        const switchProfileCommand = SlashCommand.fromProps({
            name: 'switch',
            callback: async (namedArgs, unnamedArgs) => {  // ← async обязателен
                const args = unnamedArgs.trim();

                if (!args || isNaN(args)) {
                    toastr.warning('Укажите номер профиля! Пример: /switch 2');
                    return;
                }

                jQuery.post('/api/extensions/profile-switcher/switch', {
                    profile: args
                })
                .done((data) => {
                    toastr.success(data.message || `Переключено на профиль ${args}`);
                })
                .fail((xhr) => {
                    let errorMsg = 'Ошибка переключения профиля';
                    if (xhr.responseJSON && xhr.responseJSON.error) {
                        errorMsg = xhr.responseJSON.error;
                    }
                    toastr.error(errorMsg);
                    console.error('>>> PROFILE SWITCHER: Ошибка ответа:', xhr);
                });
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
