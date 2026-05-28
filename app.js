// Curriculum Syllabus Data Model (Phases 1-4 mapped directly from BRD parameters)
const CURRICULUM_DATA = {
    1: { name: "Month 1: The Foundation", phase: "Beginner", focus: "Joint mobility, basic shapes alignment.", peak: "Crow Pose Setup" },
    2: { name: "Month 2: Strength Building", phase: "Beginner", focus: "Chaturanga mechanics, muscular endurance.", peak: "Crow Pose (Foot Lift)" },
    3: { name: "Month 3: Intro to Inversions", phase: "Beginner", focus: "Dolphin Pose, Wall L-Stands structural stack.", peak: "Tripod Headstand Setup" },
    4: { name: "Month 4: Core & Flight Connection", phase: "Beg-to-Int", focus: "Arm balances core leverage dynamics.", peak: "Side Crow (Parsva Bakasana)" },
    5: { name: "Month 5: Spinal Flexibility & Backbends", phase: "Beg-to-Int", focus: "Thoracic spine opening, active shoulder activation.", peak: "Full Wheel Pose" },
    6: { name: "Month 6: Supported Inversions", phase: "Beg-to-Int", focus: "Headstand control, learn safe tuck and roll maneuvers.", peak: "Tripod Sirsasana II" },
    7: { name: "Month 7: Hip Openers meet Arm Balances", phase: "Int-to-Adv", focus: "Splits training, extreme hip integration.", peak: "Eight-Angle Pose" },
    8: { name: "Month 8: The Forearm Base", phase: "Int-to-Adv", focus: "Pincha Mayurasana conditioning, chest opening.", peak: "Forearm Balance (Pincha)" },
    9: { name: "Month 9: Intro to Transitions", phase: "Int-to-Adv", focus: "Seamless shape variations linking frameworks.", peak: "Crow to Tripod Headstand" },
    10: { name: "Month 10: Quest for Handstand", phase: "Advanced", focus: "Wrists weight bearing stack, pelvic control.", peak: "Freestanding Handstand" },
    11: { name: "Month 11: Advanced Transitions", phase: "Advanced", focus: "Defying gravity linkages, lowering control dynamics.", peak: "Forearm Stand to Scorpion" },
    12: { name: "Month 12: Peak Mastery & Integration", phase: "Advanced", focus: "Stamina and intuitive fluid vinyasa flows.", peak: "Flying Crow & Transitions" }
};

// Reusable Weekly Template Tracker Rules (Determined by modulo math 1-7)
const WEEKLY_TEMPLATE = {
    1: { theme: "Arm Balance Flow", detail: "Beg: Crow Prep → Int: Side Crow → Adv: Flying Pigeon" },
    2: { theme: "Hip Opening", detail: "Beg: Pigeon Pose → Int: Splits Prep → Adv: Compass / Lotus" },
    3: { theme: "Inversion", detail: "Beg: Wall L-Stand → Int: Headstand → Adv: Handstand" },
    4: { theme: "Balance & Core", detail: "Beg: Tree / Plank → Int: Warrior III → Adv: Toe Taps to Handstand" },
    5: { theme: "Backbend", detail: "Beg: Bridge → Int: Wheel Pose → Adv: King Pigeon / Scorpion" },
    6: { theme: "Arm Balance → Inversion", detail: "Beg: Crow to Plank → Int: Crow to Headstand → Adv: Handstand to Crow" },
    7: { theme: "Rest & Restore", detail: "Passive stretches, yin yoga, and deep non-negotiable wrist care care." }
};

// Screen Switcher Core Context Engine
function switchTab(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(`${screenId}-screen`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('sage-accent');
        btn.classList.add('text-stone-400');
    });
    
    event.currentTarget.classList.add('sage-accent');
    event.currentTarget.classList.remove('text-stone-400');

    if(screenId === 'practice') {
        renderHistory();
    } else if(screenId === 'reflection') {
        renderReflectionDashboard();
    } else if(screenId === 'plans') {
        // Otomatis render tampilan default saat tab Plans dibuka
        renderCalendarScrollTimeline();
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

// PLAN MODULE IMPLEMENTATION LOGIC (FIXED SWITCHER MECHANICS)
function togglePlanView(mode) {
    const viewManual = document.getElementById('view-manual-plan');
    const viewChallenge = document.getElementById('view-challenge-plan');
    const btnManual = document.getElementById('btn-view-manual');
    const btnChallenge = document.getElementById('btn-view-challenge');

    if (mode === 'manual') {
        viewManual.classList.remove('hidden');
        viewChallenge.classList.add('hidden');
        btnManual.className = "flex-1 py-2 text-center rounded-lg bg-white shadow-xs text-stone-800 transition font-medium";
        btnChallenge.className = "flex-1 py-2 text-center rounded-lg text-stone-500 transition font-normal";
        renderCalendarScrollTimeline();
    } else {
        viewManual.classList.add('hidden');
        viewChallenge.classList.remove('hidden');
        btnChallenge.className = "flex-1 py-2 text-center rounded-lg bg-white shadow-xs text-stone-800 transition font-medium";
        btnManual.className = "flex-1 py-2 text-center rounded-lg text-stone-500 transition font-normal";
        loadChallengeCurriculumTrack();
        renderActiveChallengeGrid();
    }
}

// View 1 Render Engine: Infinite-Style Downward Scroll Calendar Timeline
function renderCalendarScrollTimeline() {
    const container = document.getElementById('calendar-scroll-container');
    if(!container) return; // Guard clause mencegah error jika tab belum ke-load
    container.innerHTML = '';

    const manualPlans = JSON.parse(localStorage.getItem('yoga_manual_plans')) || {};
    const today = new Date();

    for (let i = 0; i < 14; i++) {
        const currentTargetDate = new Date(today);
        currentTargetDate.setDate(today.getDate() + i);
        
        const dateStringKey = currentTargetDate.toISOString().split('T')[0];
        const displayLabel = currentTargetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        const planSubmitted = manualPlans[dateStringKey];
        
        const blockNode = document.createElement('div');
        if (planSubmitted) {
            blockNode.className = "flex justify-between items-center p-3 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs transition-all";
            blockNode.innerHTML = `
                <div class="text-xs">
                    <span class="block font-bold text-emerald-900">${displayLabel}</span>
                    <span class="text-emerald-700 italic mt-0.5 block">${planSubmitted.style} — ${planSubmitted.notes || 'No custom notes set'}</span>
                </div>
                <span class="text-sm">✅</span>
            `;
        } else {
            blockNode.className = "flex justify-between items-center p-3 rounded-xl bg-stone-50/50 border border-stone-200/40 text-stone-400";
            blockNode.innerHTML = `
                <span class="text-xs font-medium">${displayLabel}</span>
                <span class="text-[10px] uppercase font-bold tracking-wider text-stone-300">Unscheduled</span>
            `;
        }
        container.appendChild(blockNode);
    }
}

function submitManualPlan() {
    const dateField = document.getElementById('plan-date').value;
    const styleField = document.getElementById('plan-style').value;
    const notesField = document.getElementById('plan-notes').value;

    if (!dateField) {
        alert("Please assign a targeted timeline date node configuration.");
        return;
    }

    let manualPlans = JSON.parse(localStorage.getItem('yoga_manual_plans')) || {};
    manualPlans[dateField] = { style: styleField, notes: notesField };
    localStorage.setItem('yoga_manual_plans', JSON.stringify(manualPlans));

    document.getElementById('plan-date').value = '';
    document.getElementById('plan-notes').value = '';

    renderCalendarScrollTimeline();
}

// View 2 Render Engine: 30-Day Curricular System Mechanics
function loadChallengeCurriculumTrack() {
    const selectEl = document.getElementById('challenge-month-select');
    const detailsNode = document.getElementById('challenge-details-card');
    if(!selectEl || !detailsNode) return;

    const selectionId = selectEl.value;
    const curriculumItem = CURRICULUM_DATA[selectionId];

    detailsNode.innerHTML = `
        <div><strong>Phase Rank:</strong> ${curriculumItem.phase}</div>
        <div><strong>Focal Area:</strong> ${curriculumItem.focus}</div>
        <div class="text-emerald-800 font-medium mt-1"><strong>Target Peak Shape:</strong> ${curriculumItem.peak}</div>
    `;
}

function joinSelectedChallengeTrack() {
    const selectionId = document.getElementById('challenge-month-select').value;
    const targetChallenge = CURRICULUM_DATA[selectionId];

    const confirmJoin = confirm(`Would you like to commit and join the 30-Day track for "${targetChallenge.name}"?`);
    if (!confirmJoin) return;

    const activeTrackObject = {
        monthId: selectionId,
        title: targetChallenge.name,
        completions: {}
    };

    localStorage.setItem('yoga_active_challenge', JSON.stringify(activeTrackObject));
    renderActiveChallengeGrid();
}

function renderActiveChallengeGrid() {
    const wrapper = document.getElementById('active-challenge-wrapper');
    const gridContainer = document.getElementById('challenge-grid-container');
    const titleNode = document.getElementById('active-challenge-title');
    const badgeNode = document.getElementById('challenge-completion-badge');

    if(!wrapper || !gridContainer) return;

    const activeTrack = JSON.parse(localStorage.getItem('yoga_active_challenge'));

    if (!activeTrack) {
        wrapper.classList.add('hidden');
        return;
    }

    wrapper.classList.remove('hidden');
    titleNode.innerText = activeTrack.title;

    gridContainer.innerHTML = '';
    let completedCount = 0;

    for (let dayNumber = 1; dayNumber <= 30; dayNumber++) {
        let templateIndex = dayNumber % 7;
        if (templateIndex === 0) templateIndex = 7;

        const dayMeta = WEEKLY_TEMPLATE[templateIndex];
        const isChecked = activeTrack.completions[dayNumber] || false;
        if (isChecked) completedCount++;

        const nodeBtn = document.createElement('button');
        nodeBtn.type = "button";
        nodeBtn.onclick = () => toggleDayCompletionNode(dayNumber);
        
        nodeBtn.title = `${dayMeta.theme}: ${dayMeta.detail}`;

        if (isChecked) {
            nodeBtn.className = "p-2 rounded-xl text-[10px] font-bold text-center border cursor-pointer transition bg-emerald-800 border-emerald-900 text-white shadow-xs";
            nodeBtn.innerHTML = `<div>Day ${dayNumber}</div><div class="text-[8px] opacity-80 truncate">${dayMeta.theme}</div><div class="mt-0.5 text-xs">✅</div>`;
        } else {
            if (templateIndex === 7) {
                nodeBtn.className = "p-2 rounded-xl text-[10px] font-medium text-center border cursor-pointer transition bg-stone-100 border-stone-200 text-stone-500 hover:bg-stone-200/50";
                nodeBtn.innerHTML = `<div>Day ${dayNumber}</div><div class="text-[8px] opacity-70 truncate text-emerald-700 font-bold">Restore</div><div class="mt-0.5 text-xs">🪵</div>`;
            } else {
                nodeBtn.className = "p-2 rounded-xl text-[10px] font-medium text-center border cursor-pointer transition bg-white border-stone-200 text-stone-700 hover:bg-stone-50";
                nodeBtn.innerHTML = `<div>Day ${dayNumber}</div><div class="text-[8px] opacity-70 truncate">${dayMeta.theme}</div><div class="mt-0.5 text-xs opacity-0">⭕</div>`;
            }
        }
        gridContainer.appendChild(nodeBtn);
    }

    const finalPercentage = Math.round((completedCount / 30) * 100);
    badgeNode.innerText = `${finalPercentage}% Done`;
}

function toggleDayCompletionNode(dayNum) {
    let activeTrack = JSON.parse(localStorage.getItem('yoga_active_challenge'));
    if (!activeTrack) return;

    activeTrack.completions[dayNum] = !activeTrack.completions[dayNum];
    localStorage.setItem('yoga_active_challenge', JSON.stringify(activeTrack));
    
    renderActiveChallengeGrid();
}

// REFLECTION ANALYSIS DASHBOARD COMPILER
function renderReflectionDashboard() {
    const logs = JSON.parse(localStorage.getItem('yoga_checkins')) || [];
    
    const statsTotal = document.getElementById('stats-total');
    const statsStyle = document.getElementById('stats-style');
    const moodContainer = document.getElementById('mood-diagram-container');
    const somaticContainer = document.getElementById('somatic-diagram-container');
    const motivationText = document.getElementById('motivation-text');

    statsTotal.innerText = logs.length;

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

    let favoriteStyle = Object.keys(styleMap).reduce((a, b) => styleMap[a] > styleMap[b] ? a : b, "None");
    statsStyle.innerText = favoriteStyle;

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
                <span class="font-mono text-stone-400
