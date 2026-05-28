// Screen Context Switcher Engine
function switchTab(screenId) {
    // Hide all application viewpoints
    document.querySelectorAll('.app-screen').forEach(screen => screen.classList.add('hidden'));
    
    // Mount targeted viewport interface
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
    
    // Reset global tab button highlights
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('sage-accent');
        btn.classList.add('text-stone-400');
    });
    
    // Highlight currently triggered interface trigger
    event.currentTarget.classList.add('sage-accent');
    event.currentTarget.classList.remove('text-stone-400');

    // Dynamic execution block: Re-render practice log on navigation trigger
    if(screenId === 'practice') {
        renderHistory();
    }
}

// UI Interaction Architecture: Mutual Exclusion Logic for Body State Choices
function toggleInjuryOptions(noInjuryCheckbox) {
    if (noInjuryCheckbox.checked) {
        // Clear all localized strain declarations instantly if user asserts physical wellness
        document.querySelectorAll('.injury-specific').forEach(cb => {
            cb.checked = false;
        });
    }
}

// Dynamically watch specific inputs to undo the "No Injury" status if an injury is added
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('injury-specific') && e.target.checked) {
        document.getElementById('no-injury-check').checked = false;
    }
});

// Primary System Event Process: Daily Check-In Record Compilation
function submitCheckIn() {
    const selectedMood = document.getElementById('mood-input').value;
    const chosenStyle = document.getElementById('style-input').value;
    const enteredPoses = document.getElementById('poses-input').value;
    
    // Map currently targeted checkboxes to array structures
    let physicalConcerns = [];
    document.querySelectorAll('.body-concern:checked').forEach(cb => physicalConcerns.push(cb.value));

    // Fallback assignment: If no options are checked, gently default safely to No Injury framework
    if (physicalConcerns.length === 0) {
        physicalConcerns.push("No Injury");
        document.getElementById('no-injury-check').checked = true;
    }

    // Build the data structural schema matching the BRD
    const checkInRecord = {
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        mood: selectedMood,
        style: chosenStyle,
        poses: enteredPoses ? enteredPoses.split(',').map(p => p.trim()) : [],
        injury_area: physicalConcerns
    };
    
    // Commit payload to browser LocalStorage array structures
    let existingLogs = JSON.parse(localStorage.getItem('yoga_checkins')) || [];
    existingLogs.unshift(checkInRecord); // Prepend so new entries sit neatly at the top
    localStorage.setItem('yoga_checkins', JSON.stringify(existingLogs));

    // Trigger Recommendation System Logic Engines
    calculateRecommendations(selectedMood, physicalConcerns);
}

// System Rule Engine Calculation Logic Block
function calculateRecommendations(mood, concerns) {
    const box = document.getElementById('recommendation-box');
    const text = document.getElementById('recommendation-text');
    
    box.classList.remove('hidden');

    // Rule Logic 1: The Balanced Vibrant State
    if (concerns.includes('No Injury') && (mood === 'Calm' || mood === 'Grounded' || mood === 'Happy')) {
        text.innerHTML = `Your body and mind are beautifully aligned and open today! ✨<br><br>
        <strong>Suggested Flow:</strong> A full Vinyasa Flow or a structured Ashtanga series.<br>
        <strong>Mindful Tip:</strong> Your kinetic baseline is steady. It is an amazing day to safely explore targets like Crow Pose or Pincha if it feels right.`;
    } 
    // Rule Logic 2: Protective & Somatic Restorative Requirements Intercept
    else if (concerns.includes('Lower Back') || concerns.includes('Fatigue') || concerns.includes('Neck') || mood === 'Overwhelmed' || mood === 'Anxious') {
        text.innerHTML = `Your system is asking for soft, safe spaces right now. 🍃<br><br>
        <strong>Suggested Flow:</strong> Deep Yin Yoga, Restorative structural alignment, or simple Pranayama (breathwork).<br>
        <strong>Anatomical Warning:</strong> Intentionally bypass aggressive inversions or intense core spinal extensions. Focus entirely on decompression.`;
    } 
    // Rule Logic 3: Baseline Fallback Equilibrium Path
    else {
        text.innerHTML = `Your system presents a standard, intuitive foundation today. <br><br>
        <strong>Suggested Flow:</strong> Slow Hatha exploration or an intentional mobility framework.<br>
        <strong>Mindful Tip:</strong> Move rhythmically. Listen attentively to your breathing space over pure flexibility depths.`;
    }
}

// Local Storage Reading Engine (Renders into Practice History View)
function renderHistory() {
    const container = document.getElementById('history-container');
    const logs = JSON.parse(localStorage.getItem('yoga_checkins')) || [];

    if (logs.length === 0) {
        container.innerHTML = `<p class="text-stone-400 italic text-center">No practices logged yet. Complete your first check-in above!</p>`;
        return;
    }

    container.innerHTML = ''; // Wipe out baseline loading states
    
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
