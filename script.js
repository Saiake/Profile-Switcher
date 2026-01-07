(function () {
    const { SlashCommandParser, SlashCommand } = SillyTavern.getContext().slashCommand;

    const switchProfileCommand = SlashCommand.fromProps({
        name: 'switch',
        callback: async (namedArgs, unnamedArgs) => {
            const args = unnamedArgs.join(' ').trim();

            if (!args) {
                toastr.warning('Укажите номер профиля! Пример: /switch 2');
                return;
            }

            try {
                await fetch('http://localhost:9000/hooks/switch?id=' + args);
                toastr.success('Переключаюсь на профиль ' + args);
            } catch (e) {
                toastr.error('Ошибка: ' + e.message);
            }
        },
        helpString: 'Переключает на указанный профиль. Пример: /switch 2',
    });

    SlashCommandParser.addCommandObject(switchProfileCommand);
})();