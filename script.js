// script.js — обработка формы: сбор данных, валидация, сохранение в JSON-файл (отправка через JS)

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const feedbackDiv = document.getElementById('formFeedback');

    // Функция скачивания JSON-файла
    function downloadJSON(data, filename = 'contact_data.json') {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Генерация имени файла с меткой времени
    function getTimestampFilename(base = 'timofey_kozlov_form') {
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        return `${base}_${timestamp}.json`;
    }

    // Валидация полей формы
    function validateForm(nameVal, emailVal, messageVal) {
        if (!nameVal.trim()) {
            return "Пожалуйста, укажите ваше имя.";
        }
        if (!emailVal.trim()) {
            return "Введите адрес электронной почты.";
        }
        const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (!emailPattern.test(emailVal.trim())) {
            return "Введите корректный email (например, name@domain.ru).";
        }
        if (!messageVal.trim()) {
            return "Напишите сообщение — я хочу узнать детали вашего проекта.";
        }
        return null; // всё ок
    }

    // Обработчик отправки формы (отправка через JS)
    form.addEventListener('submit', function(e) {
        e.preventDefault();  // Отменяем стандартную отправку

        // Получаем значения полей
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Валидация
        const errorMessage = validateForm(name, email, message);
        if (errorMessage) {
            feedbackDiv.innerHTML = `<div class="alert alert-danger alert-custom py-2 mb-0">⚠️ ${errorMessage}</div>`;
            setTimeout(() => {
                if (feedbackDiv.firstChild) feedbackDiv.innerHTML = '';
            }, 3000);
            return;
        }

        // Формируем объект данных для JSON
        const formData = {
            fullName: name,
            email: email,
            message: message,
            submittedAt: new Date().toISOString(),
            recipient: "Тимофей Козлов (Портфолио)",
            additionalInfo: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                referrer: document.referrer || "Прямой визит"
            }
        };

        // Генерируем уникальное имя файла
        const filename = getTimestampFilename('contact_timofey');

        try {
            // Сохраняем JSON-файл (скачивание на устройство пользователя)
            downloadJSON(formData, filename);
            // Показываем сообщение об успехе
            feedbackDiv.innerHTML = `<div class="alert alert-success alert-custom py-2 mb-0">✅ Успешно! Данные сохранены в JSON-файл "${filename}". Файл загружен автоматически.</div>`;
            // Опционально: очищаем форму? (раскомментируйте, если нужно)
            // nameInput.value = '';
            // emailInput.value = '';
            // messageInput.value = '';
            setTimeout(() => {
                if (feedbackDiv.firstChild && feedbackDiv.firstChild.classList && feedbackDiv.firstChild.classList.contains('alert-success')) {
                    feedbackDiv.innerHTML = '';
                }
            }, 6000);
        } catch (err) {
            console.error(err);
            feedbackDiv.innerHTML = `<div class="alert alert-danger alert-custom py-2 mb-0">❌ Ошибка при создании JSON файла. Попробуйте еще раз.</div>`;
            setTimeout(() => {
                if (feedbackDiv.firstChild) feedbackDiv.innerHTML = '';
            }, 4000);
        }
    });
});
