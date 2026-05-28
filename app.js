// Screen Context Switcher Engine
function switchTab(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('sage-accent');
        btn.classList.add('text-stone-400');
    });
    
    event.currentTarget.classList.add('sage-accent');
    event.currentTarget.classList.remove('text-stone-400');

    // Run dynamic view loading mechanics
    if(screenId === 'practice') {
        renderHistory();
    } else if(screenId === 'reflection') {
        renderReflectionDashboard();
    }
}

function toggleInjuryOptions(noInjuryCheckbox) {
    if (noInjuryCheckbox.checked) {
        document.querySelectorAll('.injury-specific').forEach(cb => {
            cb.checked = false;
        });
    }
}

document.addEventListener('change', function(e) {
    if (e.target.classList.contains('injury-specific') && e.target.checked) {
        document.getElementById('no-injury-check').checked = false;
    }
});

function submitCheckIn() {
    const selectedMood = document.getElementById('mood-input').value;
    const chosenStyle = document.getElementById('style-input').value;
    const enteredPoses = document.getElementById('poses-input').value;
    
    let physicalConcerns = [];
    document.querySelectorAll('.body-concern:checked').forEach(cb => physicalConcerns.push(cb.value));

    if (physicalConcerns.length === 0) {
        physicalConcerns.push("No Injury");
        document.getElementById('no-injury-check').checked = true;
    }

    const checkInRecord = {
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        mood: selectedMood,
        style: chosenStyle,
        poses: enteredPoses ? enteredPoses.split(',').map(p => p.trim()) : [],
        injury_area: physicalConcerns
    };
    
    let existingLogs = JSON.parse(localStorage.getItem('yoga_checkins')) || [];
    existingLogs.unshift(checkInRecord);
    localStorage.setItem('yoga_checkins', JSON.stringify(existingLogs));

    calculateRecommendations(selectedMood, physicalConcerns);
}

function calculateRecommendations(mood, concerns) {
    const box = document.getElementById('recommendation-box');
    const text = document.getElementById('recommendation-text');
    
    box.classList.remove('hidden');

    if (concerns.includes('No Injury') && (mood === 'Calm' || mood === 'Grounded' || mood === 'Happy')) {
        text.innerHTML = `Your body and mind are beautifully aligned and open today! ✨<br><br>
        <strong>Suggested Flow:</strong> A full Vinyasa Flow or a structured Ashtanga series.<br>
        <strong>Mindful Tip:</strong> Your kinetic baseline is steady. It is an amazing day to safely explore targets like Crow Pose or Pincha if it feels right.`;
    } 
    else if (concerns.includes('Lower Back') || concerns.includes('Fatigue') || concerns.includes('Neck') || mood === 'Overwhelmed' || mood === 'Anxious') {
        text.innerHTML = `Your system is asking for soft, safe spaces right now. 🍃<br><br>
        <strong>Suggested Flow:</strong> Deep Yin Yoga, Restorative structural alignment, or simple Pranayama (breathwork).<br>
        <strong>Anatomical Warning:</strong> Intentionally bypass aggressive inversions or intense core spinal extensions. Focus entirely on decompression.`;
    } 
    else {
        text.innerHTML = `Your system presents a standard, intuitive foundation today. <br><br>
        <strong>Suggested Flow:</strong> Slow Hatha exploration or an intentional mobility framework.<br>
        <strong>Mindful Tip:</strong> Move rhythmically. Listen attentively to your breathing space over pure flexibility depths.`;
    }
}

function renderHistory() {
    const container = document.getElementById('history-container');
    const logs = JSON.parse(localStorage.getItem('yoga_checkins')) || [];

    if (logs.length === 0) {
        container.innerHTML = `<p class="text-stone-400 italic text-center">No practices logged yet. Complete your first check-in above!</p>`;
        return;
    }

    container.innerHTML = '';
    
    logs.forEach(log => {
        const poseBadges = log.poses.map(p => `<span class="bg-stone-100 px-2 py-0.5 rounded text-xs text-stone-600 font-mono">${p}</span>`).join(' ');
        const concernString = log.injury_area.join(', ');

        const card = document.createElement('div');
        card.className = "p-4 bg-stone-50/50 rounded-xl border border-stone-200/60 space-y-2";
        card.innerHTML = `
            <div class="flex justify-between items-center border-b border-stone-100 pb-1">
                <span class="text-xs font-bold font-mono text-stone-400">${log.timestamp}</span>
                <span class="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">${log.style}</span>
            </div>
            <div class="text-xs text-stone-600 space-y-1">
                <div><strong>Mood Vector:</strong> ${log.mood}</div>
                <div><strong>Anatomical Mapping:</strong> <span class="${log.injury_area.includes('No Injury') ? 'text-emerald-700 font-medium' : 'text-amber-700'}">${concernString}</span></div>
                ${log.poses.length > 0 ? `<div class="mt-2 flex flex-wrap gap-1 items-center"><strong>Poses:</strong> ${poseBadges}</div>` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// NEW FUNCTION: Compiles Data and Renders Diagrams inside Reflection Tab
function renderReflectionDashboard() {
    const logs = JSON.parse(localStorage.getItem('yoga_checkins')) || [];
    
    const statsTotal = document.getElementById('stats-total');
    const statsStyle = document.getElementById('stats-style');
    const moodContainer = document.getElementById('mood-diagram-container');
    const somaticContainer = document.getElementById('somatic-diagram-container');
    const motivationText = document.getElementById('motivation-text');

    statsTotal.innerText = logs.length;

    // Loading Framework state if data doesn't exist yet
    if (logs.length === 0) {
        statsStyle.innerText = "None Yet";
        moodContainer.innerHTML = `<p class="text-xs italic text-stone-400 text-center py-4">Complete your daily check-in to draw the mood landscape diagram.</p>`;
        somaticContainer.innerHTML = `<p class="text-xs italic text-stone-400 text-center py-4">Complete your daily check-in to map body concern graphs.</p>`;
        motivationText.innerHTML = `"Every journey begins with a single intentional breath. Step onto your mat today and listen closely to what your body needs. Sukhinah Bhavantu."`;
        return;
    }

    let styleMap = {};
    let moodMap = {};
    let somaticMap = {};

    logs.forEach(log => {
        styleMap[log.style] = (styleMap[log.style] || 0) + 1;
        moodMap[log.mood] = (moodMap[log.mood] || 0) + 1;
        log.injury_area.forEach(area => {
            somaticMap[area] = (somaticMap[area] || 0) + 1;
        });
    });

    // Calculate Favorite Style
    let favoriteStyle = Object.keys(styleMap).reduce((a, b) => styleMap[a] > styleMap[b] ? a : b, "None");
    statsStyle.innerText = favoriteStyle;

    // Render Diagram 1: Mood Landscape Bars
    moodContainer.innerHTML = '';
    Object.keys(moodMap).forEach(key => {
        const count = moodMap[key];
        const percentage = Math.round((count / logs.length) * 100);
        
        const row = document.createElement('div');
        row.className = "space-y-1";
        row.innerHTML = `
            <div class="flex justify-between text-xs text-stone-600">
                <span>${key}</span>
                <span class="font-mono font-bold text-stone-500">${percentage}% (${count}d)</span>
            </div>
            <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div class="sage-bg h-full rounded-full" style="width: ${percentage}%"></div>
            </div>
        `;
        moodContainer.appendChild(row);
    });

    // Render Diagram 2: Somatic Matrix Bars
    somaticContainer.innerHTML = '';
    Object.keys(somaticMap).forEach(key => {
        const count = somaticMap[key];
        const percentage = Math.round((count / logs.length) * 100);
        const barColor = key === 'No Injury' ? 'bg-emerald-600' : 'bg-amber-600/70';

        const row = document.createElement('div');
        row.className = "space-y-1";
        row.innerHTML = `
            <div class="flex justify-between text-xs text-stone-600">
                <span class="${key === 'No Injury' ? 'text-emerald-700 font-medium' : ''}">${key}</span>
                <span class="font-mono text-stone-400">${percentage}% of entries</span>
            </div>
            <div class="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div class="${barColor} h-full rounded-full" style="width: ${percentage}%"></div>
            </div>
        `;
        somaticContainer.appendChild(row);
    });

    // Smart Motivation Engine (Changes text depending on user inputs)
    const recentLog = logs[0];
    if (recentLog.injury_area.includes('No Injury')) {
        motivationText.innerHTML = `"Your body feels light and beautifully open today! Enjoy this vibrant energy on the mat, listen to your intuition, and let your practice bring you deep inner happiness. Sukhinah Bhavantu."`;
    } else if (recentLog.mood === 'Overwhelmed' || recentLog.mood === 'Anxious' || recentLog.injury_area.includes('Fatigue')) {
        motivationText.innerHTML = `"It is perfectly human to feel tired or heavy sometimes. Remember, yoga is not about forcing your body into shapes—it is about creating soft spaces to breathe and heal. Listen to your body, rest without guilt, and move gently today. True happiness comes from self-compassion."`;
    } else {
        motivationText.innerHTML = `"Thank you for showing up for yourself today. Every mindful stretch and steady breath clears away your stress and balances your energy. Trust your natural rhythm on this journey. Sukhinah Bhavantu."`;
    }
}
