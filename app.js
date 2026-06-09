// UniSphere App Logic

// Initial seed data (loaded if localStorage is empty)
const defaultCourses = [
  { id: 'c1', name: 'Object Oriented Programming', code: 'CS201', progress: 72, color: 'var(--accent-violet)' },
  { id: 'c2', name: 'Database Management Systems', code: 'CS204', progress: 48, color: 'var(--accent-cyan)' },
  { id: 'c3', name: 'Linear Algebra', code: 'MTH302', progress: 85, color: 'var(--accent-emerald)' }
];

const defaultDecks = {
  'Computer Science': [
    { q: 'What is the time complexity of searching in a Balanced Binary Search Tree?', a: 'O(log n)', mastered: false },
    { q: 'What is the difference between a process and a thread?', a: 'A process is an independent execution unit with its own memory space, while a thread is a lightweight execution unit sharing the memory space of its parent process.', mastered: false },
    { q: 'What is polymorphism in Object-Oriented Programming?', a: 'The ability of different classes to respond to the same method call in their own unique way, typically achieved through interface implementation or method overriding.', mastered: true }
  ],
  'Mathematics': [
    { q: 'What is the determinant of an identity matrix?', a: '1', mastered: true },
    { q: 'What defines a linear transformation?', a: 'A mapping T between vector spaces that preserves vector addition T(u+v) = T(u)+T(v) and scalar multiplication T(cu) = cT(u).', mastered: false }
  ]
};

const defaultTasks = [
  { id: 't1', title: 'Submit DBMS Lab 3', category: 'assignment', date: '2026-06-12', completed: false },
  { id: 't2', title: 'Linear Algebra Midterm Exam', category: 'exam', date: '2026-06-15', completed: false },
  { id: 't3', title: 'Read Chapter 5 of DBMS Textbook', category: 'reading', date: '2026-06-10', completed: true }
];

const defaultGPA = [
  { id: 'g1', name: 'Introduction to Programming', grade: '4.0', credits: 3 },
  { id: 'g2', name: 'Calculus I', grade: '3.7', credits: 4 },
  { id: 'g3', name: 'Discrete Mathematics', grade: '3.3', credits: 3 }
];

// App State
let state = {
  courses: JSON.parse(localStorage.getItem('uni_courses')) || defaultCourses,
  decks: JSON.parse(localStorage.getItem('uni_decks')) || defaultDecks,
  tasks: JSON.parse(localStorage.getItem('uni_tasks')) || defaultTasks,
  gpa: JSON.parse(localStorage.getItem('uni_gpa')) || defaultGPA,
  focusTimeToday: parseInt(localStorage.getItem('uni_focus_time')) || 90, // mock starting minutes
  focusTargetToday: 240, // 4 hours target
  pomodoroCount: parseInt(localStorage.getItem('uni_pomodoro_count')) || 3
};

// State persistence
function saveState() {
  localStorage.setItem('uni_courses', JSON.stringify(state.courses));
  localStorage.setItem('uni_decks', JSON.stringify(state.decks));
  localStorage.setItem('uni_tasks', JSON.stringify(state.tasks));
  localStorage.setItem('uni_gpa', JSON.stringify(state.gpa));
  localStorage.setItem('uni_focus_time', state.focusTimeToday);
  localStorage.setItem('uni_pomodoro_count', state.pomodoroCount);
  updateGlobalStats();
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  initDashboard();
  initFlashcards();
  initFocusTimer();
  initGPACalculator();
  initPlanner();
  updateGlobalStats();
  
  // Set date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', options);
});

// --- NAVIGATION & ROUTING ---
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.content-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href').substring(1);
      
      navItems.forEach(nav => nav.classList.remove('active'));
      sections.forEach(sec => sec.classList.remove('active'));
      
      item.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Handle hash change if navigating directly
  if (window.location.hash) {
    const activeItem = document.querySelector(`.nav-item[href="${window.location.hash}"]`);
    if (activeItem) activeItem.click();
  }
}

// --- GLOBAL STATS DISPLAY ---
function updateGlobalStats() {
  // GPA calculation for stats card
  const computed = calculateGPAValue();
  document.getElementById('stat-gpa').innerText = computed.gpa;

  // Study hours
  const hours = (state.focusTimeToday / 60).toFixed(1);
  document.getElementById('stat-hours').innerHTML = `${hours} <span class="unit">hrs</span>`;

  // Planner completed tasks
  const completedTasks = state.tasks.filter(t => t.completed).length;
  document.getElementById('stat-tasks').innerHTML = `${completedTasks} <span class="unit">/ ${state.tasks.length}</span>`;

  // Flashcard deck mastery
  let totalCards = 0;
  let masteredCards = 0;
  Object.keys(state.decks).forEach(deckName => {
    state.decks[deckName].forEach(card => {
      totalCards++;
      if (card.mastered) masteredCards++;
    });
  });
  const masteryPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
  document.getElementById('stat-mastery').innerHTML = `${masteryPercentage} <span class="unit">%</span>`;

  // Update daily progress focus target
  document.getElementById('current-hours-display').innerText = `${hours} hours`;
  document.getElementById('target-hours-display').innerText = `${(state.focusTargetToday / 60)} hours`;
  
  const targetPercent = Math.min(100, Math.round((state.focusTimeToday / state.focusTargetToday) * 100));
  document.getElementById('daily-percentage').innerText = `${targetPercent}%`;
  
  const circle = document.getElementById('daily-progress-circle');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (targetPercent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// --- DASHBOARD MODULE ---
function initDashboard() {
  const container = document.getElementById('courses-container');
  const addCourseBtn = document.getElementById('add-course-btn');
  const modal = document.getElementById('course-modal');
  const closeModal = document.getElementById('close-modal');
  const courseForm = document.getElementById('new-course-form');
  const dashboardStartFocus = document.getElementById('dashboard-start-focus');

  // Start focus redirects to focus tab
  dashboardStartFocus.addEventListener('click', () => {
    document.getElementById('nav-focus').click();
  });

  // Modal actions
  addCourseBtn.addEventListener('click', () => modal.classList.add('active'));
  closeModal.addEventListener('click', () => modal.classList.remove('active'));
  
  courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('course-name-input').value;
    const code = document.getElementById('course-code-input').value;
    const progress = parseInt(document.getElementById('course-progress-input').value);
    const color = document.getElementById('course-color-input').value;

    const newCourse = {
      id: 'c_' + Date.now(),
      name,
      code,
      progress,
      color
    };

    state.courses.push(newCourse);
    saveState();
    renderCourses();
    
    courseForm.reset();
    modal.classList.remove('active');
  });

  renderCourses();

  function renderCourses() {
    container.innerHTML = '';
    
    if (state.courses.length === 0) {
      container.innerHTML = '<p class="text-secondary text-center py-4">No active courses yet. Add one to track your progress!</p>';
      return;
    }

    state.courses.forEach(course => {
      const item = document.createElement('div');
      item.className = 'course-item';
      item.innerHTML = `
        <div class="course-info">
          <div class="course-meta">
            <span class="course-code" style="color: ${course.color}">${course.code}</span>
            <span class="course-percent">${course.progress}%</span>
          </div>
          <h4 class="course-name">${course.name}</h4>
          <div class="progress-track" style="margin-top: 8px;">
            <div class="progress-fill" style="width: ${course.progress}%; background: ${course.color}"></div>
          </div>
        </div>
        <div class="course-actions">
          <button class="course-ctrl-btn progress-up" title="Increment Progress"><i class="fa-solid fa-plus"></i></button>
          <button class="course-ctrl-btn progress-down" title="Decrement Progress"><i class="fa-solid fa-minus"></i></button>
          <button class="course-ctrl-btn delete-btn" title="Delete Course"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      // Event Listeners
      item.querySelector('.progress-up').addEventListener('click', () => {
        if (course.progress < 100) {
          course.progress = Math.min(100, course.progress + 5);
          saveState();
          renderCourses();
        }
      });

      item.querySelector('.progress-down').addEventListener('click', () => {
        if (course.progress > 0) {
          course.progress = Math.max(0, course.progress - 5);
          saveState();
          renderCourses();
        }
      });

      item.querySelector('.delete-btn').addEventListener('click', () => {
        state.courses = state.courses.filter(c => c.id !== course.id);
        saveState();
        renderCourses();
      });

      container.appendChild(item);
    });
  }
}

// --- FLASHCARDS MODULE ---
let currentDeckName = '';
let currentCardIndex = 0;
let flashcardFlipped = false;

function initFlashcards() {
  const deckSelector = document.getElementById('deck-selector');
  const cardDeckSelect = document.getElementById('new-card-deck');
  const cardElement = document.getElementById('active-flashcard');
  const newCardForm = document.getElementById('new-card-form');
  const newDeckBtn = document.getElementById('new-deck-btn');
  
  // Flip card trigger
  cardElement.addEventListener('click', () => {
    flashcardFlipped = !flashcardFlipped;
    cardElement.classList.toggle('flipped', flashcardFlipped);
  });

  // Rating events
  document.getElementById('rate-hard').addEventListener('click', () => rateActiveCard(false));
  document.getElementById('rate-easy').addEventListener('click', () => rateActiveCard(true));

  // Change active deck
  deckSelector.addEventListener('change', (e) => {
    currentDeckName = e.target.value;
    currentCardIndex = 0;
    flashcardFlipped = false;
    cardElement.classList.remove('flipped');
    renderActiveCard();
  });

  // Create new deck button
  newDeckBtn.addEventListener('click', () => {
    const deckName = prompt('Enter a name for the new flashcard deck:');
    if (deckName && deckName.trim() !== '') {
      const cleanName = deckName.trim();
      if (!state.decks[cleanName]) {
        state.decks[cleanName] = [];
        saveState();
        populateDeckDropdowns();
        deckSelector.value = cleanName;
        deckSelector.dispatchEvent(new Event('change'));
      } else {
        alert('A deck with that name already exists!');
      }
    }
  });

  // Create new card
  newCardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const targetDeck = cardDeckSelect.value;
    const question = document.getElementById('new-card-q').value;
    const answer = document.getElementById('new-card-a').value;

    state.decks[targetDeck].push({
      q: question,
      a: answer,
      mastered: false
    });

    saveState();
    newCardForm.reset();
    alert('Card successfully added to deck!');

    // Refresh if active
    if (targetDeck === currentDeckName) {
      renderActiveCard();
    }
  });

  populateDeckDropdowns();
  
  // Select first deck by default
  const deckKeys = Object.keys(state.decks);
  if (deckKeys.length > 0) {
    currentDeckName = deckKeys[0];
    deckSelector.value = currentDeckName;
    renderActiveCard();
  }

  function populateDeckDropdowns() {
    deckSelector.innerHTML = '';
    cardDeckSelect.innerHTML = '';

    const decksList = Object.keys(state.decks);
    decksList.forEach(deck => {
      const opt1 = document.createElement('option');
      opt1.value = deck;
      opt1.innerText = deck;
      deckSelector.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = deck;
      opt2.innerText = deck;
      cardDeckSelect.appendChild(opt2);
    });
  }

  function renderActiveCard() {
    const cards = state.decks[currentDeckName] || [];
    
    if (cards.length === 0) {
      document.getElementById('card-display-category').innerText = currentDeckName;
      document.getElementById('card-display-question').innerText = 'No cards in this deck yet. Create one on the right!';
      document.getElementById('card-display-answer').innerText = 'Press the "+" button to add a new study card.';
      document.getElementById('deck-progress-text').innerText = 'Empty Deck';
      document.getElementById('deck-mastery-ratio').innerText = 'Mastery: 0%';
      document.getElementById('deck-progress-bar').style.width = '0%';
      return;
    }

    if (currentCardIndex >= cards.length) {
      currentCardIndex = 0; // Wrap around
    }

    const card = cards[currentCardIndex];
    document.getElementById('card-display-category').innerText = currentDeckName;
    document.getElementById('card-display-question').innerText = card.q;
    document.getElementById('card-display-answer').innerText = card.a;
    
    // Progress
    document.getElementById('deck-progress-text').innerText = `Card ${currentCardIndex + 1} of ${cards.length}`;
    
    // Mastery ratio
    const masteredCount = cards.filter(c => c.mastered).length;
    const masteryPercent = Math.round((masteredCount / cards.length) * 100);
    document.getElementById('deck-mastery-ratio').innerText = `Mastery: ${masteryPercent}%`;
    document.getElementById('deck-progress-bar').style.width = `${((currentCardIndex + 1) / cards.length) * 100}%`;
  }

  function rateActiveCard(mastered) {
    const cards = state.decks[currentDeckName] || [];
    if (cards.length === 0) return;

    // Save mastery choice
    cards[currentCardIndex].mastered = mastered;
    saveState();

    // Flip card back to front with slight delay, then go to next card
    flashcardFlipped = false;
    cardElement.classList.remove('flipped');
    
    setTimeout(() => {
      currentCardIndex = (currentCardIndex + 1) % cards.length;
      renderActiveCard();
    }, 250);
  }
}

// --- FOCUS TIMER (POMODORO) ---
let timerInterval = null;
let timerTimeLeft = 1500; // 25 minutes default
let timerTotalDuration = 1500;
let timerRunning = false;
let activeMode = 'pomodoro';

function initFocusTimer() {
  const clockDisplay = document.getElementById('timer-clock');
  const playPauseBtn = document.getElementById('timer-play-pause');
  const resetBtn = document.getElementById('timer-reset');
  const progressCircle = document.getElementById('timer-progress-circle');
  const modeButtons = document.querySelectorAll('.timer-mode-btn');

  // Load sound items
  const soundItems = document.querySelectorAll('.sound-item');

  soundItems.forEach(item => {
    const audioId = `audio-${item.dataset.sound}`;
    const audio = document.getElementById(audioId);
    const playBtn = item.querySelector('.sound-play-btn');

    playBtn.addEventListener('click', () => {
      const isPlaying = item.classList.contains('playing');
      
      // Stop all first
      soundItems.forEach(si => {
        si.classList.remove('playing');
        si.querySelector('.sound-play-btn i').className = 'fa-solid fa-play';
        document.getElementById(`audio-${si.dataset.sound}`).pause();
      });

      if (!isPlaying) {
        item.classList.add('playing');
        playBtn.querySelector('i').className = 'fa-solid fa-pause';
        audio.play().catch(e => console.log('Audio playback error', e));
      }
    });
  });

  // Mode buttons switching
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const seconds = parseInt(btn.dataset.time);
      activeMode = btn.dataset.mode;
      timerTotalDuration = seconds;
      timerTimeLeft = seconds;
      timerRunning = false;
      
      clearInterval(timerInterval);
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      updateClockDisplay();
      updateTimerProgress();
    });
  });

  playPauseBtn.addEventListener('click', () => {
    if (timerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener('click', () => {
    pauseTimer();
    timerTimeLeft = timerTotalDuration;
    updateClockDisplay();
    updateTimerProgress();
  });

  updateClockDisplay();
  updateTimerProgress();

  function startTimer() {
    timerRunning = true;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    
    timerInterval = setInterval(() => {
      timerTimeLeft--;
      updateClockDisplay();
      updateTimerProgress();

      if (timerTimeLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        
        // Handle Pomodoro Complete
        handleTimerComplete();
      }
    }, 1000);
  }

  function pauseTimer() {
    timerRunning = false;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    clearInterval(timerInterval);
  }

  function updateClockDisplay() {
    const minutes = Math.floor(timerTimeLeft / 60);
    const seconds = timerTimeLeft % 60;
    clockDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateTimerProgress() {
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const percent = timerTimeLeft / timerTotalDuration;
    const offset = circumference * (1 - percent);
    progressCircle.style.strokeDashoffset = offset;
  }

  function handleTimerComplete() {
    // Alert Sound
    const alertAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav');
    alertAudio.play().catch(e => console.log('Audio error', e));

    if (activeMode === 'pomodoro') {
      const minutesAdded = Math.round(timerTotalDuration / 60);
      state.focusTimeToday += minutesAdded;
      state.pomodoroCount++;
      
      document.getElementById('completed-sessions-count').innerText = state.pomodoroCount;
      document.getElementById('total-focus-minutes').innerText = `${state.focusTimeToday}m`;
      
      saveState();
      alert('Congratulations! Focus session complete. Take a well-deserved break!');
    } else {
      alert('Break finished! Ready to focus again?');
    }
    
    // Reset back to pomodoro
    const pomoBtn = document.querySelector('.timer-mode-btn[data-mode="pomodoro"]');
    if (pomoBtn) pomoBtn.click();
  }

  // Load mini stats starting values
  document.getElementById('completed-sessions-count').innerText = state.pomodoroCount;
  document.getElementById('total-focus-minutes').innerText = `${state.focusTimeToday}m`;
}

// --- GPA CALCULATOR ---
function initGPACalculator() {
  const gpaForm = document.getElementById('gpa-form');
  const gpaTableBody = document.getElementById('gpa-table-body');
  const clearAllBtn = document.getElementById('gpa-clear-all');

  gpaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('gpa-course-name').value;
    const grade = document.getElementById('gpa-grade').value;
    const credits = parseInt(document.getElementById('gpa-credits').value);

    const newRecord = {
      id: 'g_' + Date.now(),
      name,
      grade,
      credits
    };

    state.gpa.push(newRecord);
    saveState();
    renderGPATable();
    gpaForm.reset();
    document.getElementById('gpa-credits').value = 3; // Reset default
  });

  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all grade calculator entries?')) {
      state.gpa = [];
      saveState();
      renderGPATable();
    }
  });

  renderGPATable();

  function renderGPATable() {
    gpaTableBody.innerHTML = '';

    if (state.gpa.length === 0) {
      gpaTableBody.innerHTML = '<tr><td colspan="4" class="text-secondary text-center py-4">No grades added yet. Add your courses above to calculate GPA!</td></tr>';
      updateGPADisplays(0, 0);
      return;
    }

    state.gpa.forEach(record => {
      const tr = document.createElement('tr');
      
      // Get readable grade letter
      const gradeLetter = getGradeLetter(record.grade);

      tr.innerHTML = `
        <td><strong>${record.name}</strong></td>
        <td>${gradeLetter} (${parseFloat(record.grade).toFixed(1)})</td>
        <td>${record.credits}</td>
        <td><button class="course-ctrl-btn delete-btn" style="color: var(--text-muted)"><i class="fa-solid fa-trash-can"></i></button></td>
      `;

      tr.querySelector('.delete-btn').addEventListener('click', () => {
        state.gpa = state.gpa.filter(g => g.id !== record.id);
        saveState();
        renderGPATable();
      });

      gpaTableBody.appendChild(tr);
    });

    const computed = calculateGPAValue();
    updateGPADisplays(computed.gpa, computed.totalCredits);
  }

  function updateGPADisplays(gpa, totalCredits) {
    document.getElementById('computed-gpa-value').innerText = gpa;
    document.getElementById('gpa-total-credits').innerText = totalCredits;
    
    // Honor Class Description
    let honors = 'N/A';
    const numGpa = parseFloat(gpa);
    if (numGpa >= 3.85) honors = 'Summa Cum Laude';
    else if (numGpa >= 3.7) honors = 'Magna Cum Laude';
    else if (numGpa >= 3.5) honors = 'Cum Laude';
    else if (numGpa >= 3.0) honors = 'Dean\'s List';
    else if (numGpa >= 2.0) honors = 'Satisfactory';
    else if (numGpa > 0) honors = 'Academic Warning';

    document.getElementById('gpa-honors-class').innerText = honors;
  }
}

function getGradeLetter(gradeVal) {
  const g = parseFloat(gradeVal);
  if (g >= 4.0) return 'A';
  if (g >= 3.7) return 'A-';
  if (g >= 3.3) return 'B+';
  if (g >= 3.0) return 'B';
  if (g >= 2.7) return 'B-';
  if (g >= 2.3) return 'C+';
  if (g >= 2.0) return 'C';
  if (g >= 1.7) return 'C-';
  if (g >= 1.3) return 'D+';
  if (g >= 1.0) return 'D';
  return 'F';
}

function calculateGPAValue() {
  let totalPoints = 0;
  let totalCredits = 0;

  state.gpa.forEach(record => {
    totalPoints += parseFloat(record.grade) * record.credits;
    totalCredits += record.credits;
  });

  const gpaVal = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  return {
    gpa: gpaVal,
    totalCredits
  };
}

// --- STUDY PLANNER MODULE ---
let activePlannerFilter = 'all';

function initPlanner() {
  const taskForm = document.getElementById('new-task-form');
  const todoContainer = document.getElementById('todo-list');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');

  // Submit task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const category = document.getElementById('task-category').value;
    const date = document.getElementById('task-date').value;

    const newTask = {
      id: 't_' + Date.now(),
      title,
      category,
      date,
      completed: false
    };

    state.tasks.push(newTask);
    saveState();
    renderTasks();
    taskForm.reset();
  });

  // Filter actions
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePlannerFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Clear completed
  clearCompletedBtn.addEventListener('click', () => {
    state.tasks = state.tasks.filter(t => !t.completed);
    saveState();
    renderTasks();
  });

  // Set default date in planner form to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('task-date').value = tomorrow.toISOString().substring(0, 10);

  renderTasks();

  function renderTasks() {
    todoContainer.innerHTML = '';

    const filtered = state.tasks.filter(task => {
      if (activePlannerFilter === 'all') return true;
      return task.category === activePlannerFilter;
    });

    if (filtered.length === 0) {
      todoContainer.innerHTML = `<p class="text-secondary text-center py-4">No tasks found in category "${activePlannerFilter}". Create one on the right!</p>`;
      return;
    }

    filtered.forEach(task => {
      const item = document.createElement('div');
      item.className = `todo-item ${task.completed ? 'completed' : ''}`;
      
      const formattedDate = new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      item.innerHTML = `
        <div class="todo-main">
          <div class="todo-checkbox">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="todo-details">
            <span class="todo-title">${task.title}</span>
            <div class="todo-meta">
              <span class="todo-tag tag-${task.category}">${task.category}</span>
              <span class="todo-due"><i class="fa-solid fa-calendar-days"></i> Due ${formattedDate}</span>
            </div>
          </div>
        </div>
        <div class="todo-actions">
          <button class="course-ctrl-btn delete-btn"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      `;

      // Complete toggle
      item.querySelector('.todo-checkbox').addEventListener('click', () => {
        task.completed = !task.completed;
        saveState();
        renderTasks();
      });

      // Delete task
      item.querySelector('.delete-btn').addEventListener('click', () => {
        state.tasks = state.tasks.filter(t => t.id !== task.id);
        saveState();
        renderTasks();
      });

      todoContainer.appendChild(item);
    });
  }
}
