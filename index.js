const fetch = require('node-fetch');

function init(app) {
    app.post('/api/extensions/profile-switcher/switch', async (req, res) => {
        const { profile } = req.body;

        if (!profile || isNaN(profile)) {
            return res.status(400).json({ error: 'Укажите валидный номер профиля!' });
        }

        const url = `http://gemini-switcher:9000/hooks/switch?id=${profile}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Webhook вернул ${response.status}`);
            }
            res.json({ success: true, message: `Переключено на профиль ${profile}` });
        } catch (err) {
            console.error('[Profile Switcher] Ошибка:', err);
            res.status(500).json({ error: 'Не удалось переключить профиль' });
        }
    });
}

module.exports = { init };
