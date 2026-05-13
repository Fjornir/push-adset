// Day codes mapping - all 7 days of the week
const DAY_CODES = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

let csvContent = '';

// Get DOM elements
const pushesPerDayInput = document.getElementById('pushesPerDay');
const titlesInput = document.getElementById('titles');
const bodiesInput = document.getElementById('bodies');
const timesInput = document.getElementById('times');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const previewSection = document.getElementById('previewSection');
const previewText = document.getElementById('previewText');

// Generate CSV
generateBtn.addEventListener('click', () => {
    try {
        // Get values
        const pushesPerDay = parseInt(pushesPerDayInput.value);
        const titles = titlesInput.value.trim().split('\n').filter(line => line.trim());
        const bodies = bodiesInput.value.trim().split('\n').filter(line => line.trim());
        const times = timesInput.value.trim().split('\n').filter(line => line.trim());

        // Validation
        if (!pushesPerDay || pushesPerDay < 1) {
            alert('Пожалуйста, укажите количество пушей в день (минимум 1)');
            return;
        }

        if (times.length !== pushesPerDay) {
            alert(`Количество временных периодов (${times.length}) должно совпадать с количеством пушей в день (${pushesPerDay})`);
            return;
        }

        if (titles.length === 0) {
            alert('Пожалуйста, введите хотя бы один заголовок');
            return;
        }

        if (bodies.length === 0) {
            alert('Пожалуйста, введите хотя бы одно тело сообщения');
            return;
        }

        if (titles.length !== bodies.length) {
            alert(`Количество заголовков (${titles.length}) должно совпадать с количеством тел сообщений (${bodies.length})`);
            return;
        }

        // Helper function to escape CSV fields
        const escapeCSVField = (field) => {
            // If field contains semicolon, comma, quotes, or newline, wrap in quotes
            if (field.includes(';') || field.includes(',') || field.includes('"') || field.includes('\n')) {
                // Escape existing quotes by doubling them
                return `"${field.replace(/"/g, '""')}"`;
            }
            return field;
        };

        // Generate CSV content for all 7 days
        const csvLines = [];
        
        // Iterate through all 7 days of the week
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const dayCode = DAY_CODES[dayIndex];
            
            // For each day, create pushes at each time period
            for (let timeIndex = 0; timeIndex < pushesPerDay; timeIndex++) {
                const time = times[timeIndex];
                
                // For each time, create a push for each title/body pair
                for (let msgIndex = 0; msgIndex < titles.length; msgIndex++) {
                    const title = escapeCSVField(titles[msgIndex]);
                    const body = escapeCSVField(bodies[msgIndex]);
                    
                    // Format: DAY;TIME;TITLE;BODY
                    const line = `${dayCode};${time};${title};${body}`;
                    csvLines.push(line);
                }
            }
        }

        csvContent = csvLines.join('\n');

        // Show preview
        previewText.textContent = csvContent;
        previewSection.style.display = 'block';
        downloadBtn.style.display = 'block';

        // Scroll to preview
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        alert('Произошла ошибка при генерации CSV: ' + error.message);
        console.error(error);
    }
});

// Download CSV
downloadBtn.addEventListener('click', () => {
    if (!csvContent) {
        alert('Сначала сгенерируйте CSV');
        return;
    }

    // Create blob with UTF-8 BOM for proper encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `push_notifications_${timestamp}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
});
