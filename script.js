/* 
   Sajal & Aditi's Birthday Surprise Logic
   Includes: Particle effects, 3D Polaroid Stack, Quiz Engine, Typewriter Letter, Cake blowing, and Canvas Confetti
*/

document.addEventListener("DOMContentLoaded", () => {
  // --- IMAGE FAIL-SAFE FALLBACKS (Root vs assets/ folder) ---
  
  // 1. Fallback for static images already in the DOM (e.g. scrapbook photos, cute_cats.png)
  function initStaticImageFallbacks() {
    document.querySelectorAll("img").forEach(img => {
      // If the image has already failed to load before script execution:
      if (img.complete && img.naturalWidth === 0) {
        triggerFallback(img);
      } else {
        // Set up error listener for pending loads
        img.addEventListener("error", () => {
          triggerFallback(img);
        }, { once: true });
      }
    });
  }

  function triggerFallback(img) {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("assets/") && !src.startsWith("http") && !src.startsWith("data:")) {
      console.log(`Fallback triggered for static image: ${src}`);
      img.src = `assets/${src}`;
    }
  }

  // 2. Background Image Fallback (photo7.jpeg)
  function initBackgroundFallback() {
    const bgImg = new Image();
    bgImg.onload = () => {
      // Background loaded from root successfully, nothing to do
    };
    bgImg.onerror = () => {
      console.log("Background image photo7.jpeg failed to load from root. Retrying from assets/...");
      document.body.style.background = "linear-gradient(rgba(6, 11, 8, 0.9), rgba(3, 5, 7, 0.97)), url('assets/photo7.jpeg') no-repeat center center fixed";
      document.body.style.backgroundSize = "cover";
    };
    bgImg.src = "photo7.jpeg";
  }

  // Initialize these immediately on script run
  initStaticImageFallbacks();
  initBackgroundFallback();

  // --- 1. CONFIGURATION & STATE ---
  let appState = {
    currentScreen: "screen-welcome",
    quizScore: 0,
    quizIndex: 0,
    activePhotoIndex: 0,
    audioInitialized: false,
    audioPlaying: false,
    candlesLit: 3,
    confettiActive: false
  };

  // --- 2. DECORATIVE BACKGROUNDS (Stars & Hearts) ---
  const starsContainer = document.getElementById("stars-container");
  const heartsContainer = document.getElementById("hearts-container");

  // Create Twinkling Stars
  function initStars() {
    const starCount = window.innerWidth < 500 ? 40 : 80;
    starsContainer.innerHTML = "";
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty("--duration", `${Math.random() * 3 + 2}s`);
      starsContainer.appendChild(star);
    }
  }
  initStars();
  window.addEventListener("resize", initStars);

  // Spawn Floating Hearts
  function spawnFloatingHeart() {
    if (document.hidden) return; // Don't run in background
    const heart = document.createElement("div");
    heart.className = "floating-heart";
    
    // Choose a random heart icon
    const icons = ["fa-heart", "fa-heart-pulse", "fa-heart-circle-bolt"];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    heart.innerHTML = `<i class="fa-solid ${randomIcon}"></i>`;
    
    heart.style.left = `${Math.random() * 100}%`;
    const duration = Math.random() * 4 + 4; // 4 to 8s
    heart.style.setProperty("--duration", `${duration}s`);
    heart.style.setProperty("--drift", `${Math.random() * 100 - 50}px`);
    heart.style.setProperty("--rotation", `${Math.random() * 360}deg`);
    
    const size = Math.random() * 1.2 + 0.6; // 0.6rem to 1.8rem
    heart.style.fontSize = `${size}rem`;
    heart.style.opacity = Math.random() * 0.3 + 0.15;
    
    heartsContainer.appendChild(heart);
    
    // Cleanup heart after animation finishes
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }
  setInterval(spawnFloatingHeart, 600);

  // --- 3. BACKGROUND MUSIC LOGIC ---
  const bgAudio = document.getElementById("bg-audio");
  const musicBtn = document.getElementById("music-btn");
  const musicStatus = document.getElementById("music-status");

  // Audio source fallback chain — set directly on the real player element
  const audioSources = [
    "romantic_bg.mp3",
    "assets/romantic_bg.mp3",
    CONFIG.musicUrl
  ];
  let audioSourceIndex = 0;
  let audioReady = false;       // True once the audio is buffered enough to play
  let playPending = false;      // True if user clicked play before audio was ready

  function setupAudio() {
    // Set the first source directly on the real audio element
    bgAudio.preload = "auto";
    bgAudio.src = audioSources[0];
    bgAudio.load();

    // When this source is playable, mark ready and auto-play if pending
    bgAudio.addEventListener("canplaythrough", () => {
      audioReady = true;
      console.log("Audio ready from:", audioSources[audioSourceIndex]);
      if (playPending) {
        playPending = false;
        attemptPlay();
      }
    }, { once: true });

    // If this source fails, try the next one in the chain
    bgAudio.addEventListener("error", handleAudioError, { once: true });
  }

  function handleAudioError() {
    audioSourceIndex++;
    if (audioSourceIndex < audioSources.length) {
      console.log("Audio source failed, trying fallback:", audioSources[audioSourceIndex]);
      audioReady = false;
      bgAudio.src = audioSources[audioSourceIndex];
      bgAudio.load();

      bgAudio.addEventListener("canplaythrough", () => {
        audioReady = true;
        console.log("Audio ready from fallback:", audioSources[audioSourceIndex]);
        if (playPending) {
          playPending = false;
          attemptPlay();
        }
      }, { once: true });

      bgAudio.addEventListener("error", handleAudioError, { once: true });
    } else {
      console.warn("All audio sources failed. No music available.");
      playPending = false;
    }
  }

  function attemptPlay() {
    bgAudio.play().then(() => {
      if (musicBtn) musicBtn.classList.add("playing");
      if (musicStatus) musicStatus.textContent = "Playing Song";
      appState.audioPlaying = true;
      appState.audioInitialized = true;
    }).catch(err => {
      console.log("Audio play blocked by browser:", err);
      // If blocked by autoplay policy, set pending so the next user gesture retries
      playPending = true;
    });
  }

  function toggleMusic() {
    appState.audioInitialized = true;

    if (appState.audioPlaying) {
      bgAudio.pause();
      if (musicBtn) musicBtn.classList.remove("playing");
      if (musicStatus) musicStatus.textContent = "Music Off";
      appState.audioPlaying = false;
      playPending = false;
    } else {
      if (audioReady) {
        attemptPlay();
      } else {
        // Audio hasn't loaded yet — mark pending so it auto-plays when ready
        playPending = true;
        console.log("Audio not ready yet, will auto-play when loaded...");
        if (musicStatus) musicStatus.textContent = "Loading...";
      }
    }
  }

  setupAudio();

  if (musicBtn) {
    musicBtn.addEventListener("click", toggleMusic);
  }



  // --- 4. SCREEN TRANSITION MANAGER ---
  function navigateTo(screenId) {
    const currentScreenEl = document.getElementById(appState.currentScreen);
    const nextScreenEl = document.getElementById(screenId);
    
    if (currentScreenEl && nextScreenEl) {
      currentScreenEl.style.opacity = 0;
      currentScreenEl.style.transform = "translateY(-20px) scale(0.98)";
      
      // Manage Music Button Visibility (Only visible on last stage screen-future)
      const musicContainer = document.querySelector(".music-toggle-container");
      if (musicContainer) {
        if (screenId === "screen-future") {
          musicContainer.style.display = "flex";
          // Trigger reflow & fade in
          setTimeout(() => {
            musicContainer.style.opacity = "1";
            musicContainer.style.pointerEvents = "auto";
          }, 50);
        } else {
          musicContainer.style.opacity = "0";
          musicContainer.style.pointerEvents = "none";
          setTimeout(() => {
            if (screenId !== "screen-future") {
              musicContainer.style.display = "none";
            }
          }, 500);
        }
      }
      
      setTimeout(() => {
        currentScreenEl.classList.remove("active");
        
        nextScreenEl.classList.add("active");
        // Trigger reflow
        nextScreenEl.offsetHeight; 
        
        nextScreenEl.style.opacity = 1;
        nextScreenEl.style.transform = "translateY(0) scale(1)";
        appState.currentScreen = screenId;
        
        // Trigger stage specific initializations
        if (screenId === "screen-quiz") {
          startQuiz();
        } else if (screenId === "screen-memories") {
          initMemoriesGallery();
        }
      }, 500);
    }
  }

  // Welcome Screen Button Event
  document.getElementById("btn-start").addEventListener("click", () => {
    // Start background music only when "Enter the Dream" is clicked
    // This click event is a trusted user gesture — browsers always allow play() here
    if (!appState.audioPlaying) {
      appState.audioInitialized = true;
      if (audioReady) {
        attemptPlay();
      } else {
        // Audio file hasn't loaded yet — queue it so it starts the instant it's ready
        playPending = true;
        if (musicStatus) musicStatus.textContent = "Loading...";
      }
    }
    navigateTo("screen-quiz");
  });

  // Stage 5 Celebration Screen Button Event pointing to Stage 6
  document.getElementById("btn-to-future").addEventListener("click", () => {
    navigateTo("screen-future");
  });

  // --- 5. QUIZ GAME ENGINE ---
  const quizQuestion = document.getElementById("quiz-question");
  const quizOptionsContainer = document.getElementById("quiz-options");
  const quizProgressFill = document.getElementById("quiz-progress-fill");
  const quizQuestionNumText = document.getElementById("quiz-question-number");
  const quizScoreText = document.getElementById("quiz-score");
  const quizFeedback = document.getElementById("quiz-feedback");

  // Special Q4 Twist Modal Elements
  const specialModal = document.getElementById("special-quiz-modal");
  const closeSpecialModalBtn = document.getElementById("btn-close-special-modal");

  function startQuiz() {
    appState.quizIndex = 0;
    appState.quizScore = 0;
    appState.q4Clicks = 0;
    loadQuestion();
  }

  function loadQuestion() {
    const quizCard = document.querySelector(".quiz-card");
    
    // Only animate transition if it's not the first question loading
    if (quizCard && appState.quizIndex > 0) {
      quizCard.classList.add("fade-out");
      
      setTimeout(() => {
        updateQuizContent();
        quizCard.classList.remove("fade-out");
      }, 250);
    } else {
      updateQuizContent();
    }
  }

  function updateQuizContent() {
    quizFeedback.textContent = "";
    quizFeedback.style.opacity = "0";
    quizOptionsContainer.innerHTML = "";
    
    const questionData = CONFIG.quiz[appState.quizIndex];
    quizQuestion.textContent = questionData.question;
    
    // Progress UI
    const totalQuestions = CONFIG.quiz.length;
    quizQuestionNumText.textContent = `MEMORIES > STAGE ${appState.quizIndex + 1}/${totalQuestions}`;
    const progressPercent = ((appState.quizIndex) / totalQuestions) * 100;
    quizProgressFill.style.width = `${progressPercent}%`;
    quizScoreText.textContent = `REVEAL: ${Math.round(progressPercent)}%`;

    // Render Options
    questionData.options.forEach(option => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `<span>${option}</span><i class="fa-regular fa-circle" style="font-size: 1.1rem; opacity: 0.5;"></i>`;
      
      btn.addEventListener("click", () => handleAnswerSelect(btn, option, questionData));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleAnswerSelect(selectedBtn, selectedValue, questionData) {
    const allButtons = quizOptionsContainer.querySelectorAll(".option-btn");
    
    if (questionData.isSpecial) {
      // Initialize Q4 clicks if not present
      if (typeof appState.q4Clicks === 'undefined') {
        appState.q4Clicks = 0;
      }
      
      // Mark this specific button as wrong (red with cross) and disable further clicks on it
      selectedBtn.classList.add("wrong");
      selectedBtn.querySelector("i").className = "fa-solid fa-circle-xmark";
      selectedBtn.style.pointerEvents = "none";
      
      appState.q4Clicks++;
      
      // Provide custom feedback
      if (appState.q4Clicks === 1) {
        quizFeedback.innerHTML = `<i class="fa-solid fa-face-rolling-eyes" style="margin-right: 8px;"></i> Nope, not just that! Try again! 😉`;
        quizFeedback.style.color = "#dfba6b";
      } else if (appState.q4Clicks === 2) {
        quizFeedback.innerHTML = `<i class="fa-solid fa-face-winking-face" style="margin-right: 8px;"></i> Close, but still not just that! One more try! 😜`;
        quizFeedback.style.color = "#dfba6b";
      } else if (appState.q4Clicks === 3) {
        // Disable all buttons now that they've tried everything
        allButtons.forEach(btn => btn.style.pointerEvents = "none");
        
        quizFeedback.innerHTML = `<i class="fa-solid fa-heart" style="margin-right: 8px;"></i> None of them? Let me tell you the real answer... ❤️`;
        quizFeedback.style.color = "#10b981";
        
        // Load custom title and reveal content dynamically from config
        document.getElementById("special-reveal-title").textContent = questionData.specialTitle || "Well Mr. Sajal Patil";
        document.getElementById("special-reveal-box").textContent = questionData.specialReveal || "I love everything about you❤️";
        
        setTimeout(() => {
          // Activate special modal popover
          specialModal.classList.add("active");
        }, 1500);
      }
      
      quizFeedback.style.opacity = "1";
      return;
    }

    // Disable all options during result presentation
    allButtons.forEach(btn => btn.style.pointerEvents = "none");

    const isCorrect = selectedValue === questionData.correctAnswer;
    
    if (isCorrect) {
      selectedBtn.classList.add("correct");
      selectedBtn.querySelector("i").className = "fa-solid fa-circle-check";
      quizFeedback.innerHTML = `<i class="fa-solid fa-face-laugh-beam" style="margin-right: 8px;"></i> Correct! You remember! 🥰`;
      quizFeedback.style.color = "#10b981";
      appState.quizScore++;
    } else {
      selectedBtn.classList.add("wrong");
      selectedBtn.querySelector("i").className = "fa-solid fa-circle-xmark";
      
      // Highlight the correct answer for Sajal
      allButtons.forEach(btn => {
        if (btn.querySelector("span").textContent === questionData.correctAnswer) {
          btn.classList.add("correct");
          btn.querySelector("i").className = "fa-solid fa-circle-check";
        }
      });
      
      quizFeedback.innerHTML = `<i class="fa-solid fa-face-rolling-eyes" style="margin-right: 8px;"></i> Hint: ${questionData.hint}`;
      quizFeedback.style.color = "#ef4444";
    }
    
    quizFeedback.style.opacity = "1";

    // Progress to next question after display lag
    setTimeout(() => {
      appState.quizIndex++;
      if (appState.quizIndex < CONFIG.quiz.length) {
        loadQuestion();
      }
    }, 1200);
  }

  // Handle Q4 Modal Closure & Transition to Memories Screen
  closeSpecialModalBtn.addEventListener("click", () => {
    specialModal.classList.remove("active");
    // Complete progress bar visual
    quizProgressFill.style.width = "100%";
    quizScoreText.textContent = "XP: 100%";
    
    setTimeout(() => {
      navigateTo("screen-memories");
    }, 400);
  });

  // --- 6. MEMORY LANE POLAROID DECK CAROUSEL ---
  const polaroidDeck = document.getElementById("polaroid-deck");
  const dotsContainer = document.getElementById("gallery-dots");
  const btnPrevPhoto = document.getElementById("btn-prev-photo");
  const btnNextPhoto = document.getElementById("btn-next-photo");
  const btnUnlockLetter = document.getElementById("btn-unlock-letter");

  let maxMemoriesViewed = 0;

  function initMemoriesGallery() {
    polaroidDeck.innerHTML = "";
    dotsContainer.innerHTML = "";
    appState.activePhotoIndex = 0;

    CONFIG.memories.forEach((mem, index) => {
      // 1. Create Polaroid Card Element
      const card = document.createElement("div");
      card.className = "polaroid-card";
      card.dataset.index = index;

      const imgContainer = document.createElement("div");
      imgContainer.className = "img-container polaroid-image-container";

      // Performance check: Try loading the image. If load fails, render beautiful romantic icon placeholder!
      const img = document.createElement("img");
      img.className = "polaroid-img";
      img.alt = mem.caption;
      img.style.opacity = "0"; // Hide until loaded successfully
      img.style.transition = "opacity 0.4s ease";
      
      const placeholder = document.createElement("div");
      placeholder.className = "placeholder polaroid-placeholder";
      placeholder.innerHTML = `<span>${mem.placeholderText}</span><p style="font-size: 0.8rem; margin: 0; color: #a0aec0;">Click to add photo</p>`;
      
      // Append the image element to the DOM tree immediately to prevent synchronous cache issues
      imgContainer.appendChild(img);
      
      let attemptedFallback = false;
      
      img.onload = () => {
        img.style.opacity = "1"; // Fade in when fully loaded
      };
      
      img.onerror = () => {
        if (!attemptedFallback && !mem.image.startsWith("assets/")) {
          attemptedFallback = true;
          console.log(`Gallery image failed to load: ${mem.image}. Retrying from assets/ folder...`);
          img.src = `assets/${mem.image}`;
        } else {
          img.remove();
          imgContainer.appendChild(placeholder);
        }
      };
      
      img.src = mem.image;

      // Handle synchronous loading from browser cache
      if (img.complete && img.naturalWidth > 0) {
        img.style.opacity = "1";
      }

      card.appendChild(imgContainer);

      const caption = document.createElement("div");
      caption.className = "polaroid-caption";
      caption.textContent = mem.caption;
      card.appendChild(caption);

      polaroidDeck.appendChild(card);

      // 2. Create Progress Dot
      const dot = document.createElement("div");
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener("click", () => jumpToPhoto(index));
      dotsContainer.appendChild(dot);
    });

    updateDeckPositions();
  }

  function updateDeckPositions() {
    const cards = polaroidDeck.querySelectorAll(".polaroid-card");
    const dots = dotsContainer.querySelectorAll(".dot");
    const total = cards.length;

    dots.forEach((dot, index) => {
      if (index === appState.activePhotoIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    cards.forEach((card, index) => {
      const diff = index - appState.activePhotoIndex;
      
      // Calculate stacking offsets and aesthetic angles
      if (diff === 0) {
        // Active topmost card
        card.style.transform = "translate(-50%, -50%) scale(1) rotate(2deg)";
        card.style.opacity = "1";
        card.style.zIndex = "10";
        card.style.pointerEvents = "auto";
      } else if (diff > 0) {
        // Cards stacked below the active card
        const scale = 1 - diff * 0.05;
        const translateY = -50 - diff * 5;
        const rotate = 2 + diff * 4 * (index % 2 === 0 ? 1 : -1);
        card.style.transform = `translate(-50%, ${translateY}%) scale(${scale}) rotate(${rotate}deg)`;
        card.style.opacity = `${0.9 - diff * 0.25}`;
        card.style.zIndex = `${10 - diff}`;
        card.style.pointerEvents = "none";
      } else {
        // Discarded cards that swiped away to the left
        card.style.transform = "translate(-180%, -50%) scale(0.9) rotate(-15deg)";
        card.style.opacity = "0";
        card.style.zIndex = "1";
        card.style.pointerEvents = "none";
      }
    });

    // Tracking progress completion
    if (appState.activePhotoIndex > maxMemoriesViewed) {
      maxMemoriesViewed = appState.activePhotoIndex;
    }

    if (maxMemoriesViewed >= total - 1) {
      // Sajal viewed all pictures, show message reveal button
      btnUnlockLetter.style.display = "inline-block";
      btnUnlockLetter.classList.add("animate__animated", "animate__fadeInUp");
    }
  }

  function slideNext() {
    if (appState.activePhotoIndex < CONFIG.memories.length - 1) {
      appState.activePhotoIndex++;
      updateDeckPositions();
    }
  }

  function slidePrev() {
    if (appState.activePhotoIndex > 0) {
      appState.activePhotoIndex--;
      updateDeckPositions();
    }
  }

  function jumpToPhoto(index) {
    appState.activePhotoIndex = index;
    updateDeckPositions();
  }

  btnNextPhoto.addEventListener("click", slideNext);
  btnPrevPhoto.addEventListener("click", slidePrev);
  btnUnlockLetter.addEventListener("click", () => navigateTo("screen-letter"));

  // Simple Swipe gesture handlers for Mobile/Touch
  let touchStartX = 0;
  let touchEndX = 0;

  polaroidDeck.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  polaroidDeck.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      slideNext(); // Swiped left
    } else if (touchEndX - touchStartX > swipeThreshold) {
      slidePrev(); // Swiped right
    }
  }

  // --- 7. RETRO LOVE LETTER & TYPEWRITER ENGINE ---
  const envelopeContainer = document.getElementById("envelope-container");
  const birthdayEnvelope = document.getElementById("birthday-envelope");
  const envelopePrompt = document.getElementById("envelope-prompt");
  const loveLetterDisplay = document.getElementById("love-letter-display");
  const typewriterContent = document.getElementById("typewriter-content");
  const celebrationTriggerContainer = document.getElementById("btn-to-celebration-container");

  // Dynamically set the poster recipient name from configuration
  const recipientNameEl = document.getElementById("poster-recipient-name");
  if (recipientNameEl) {
    recipientNameEl.textContent = CONFIG.partnerName.split(" ")[0]; // "Sajal"
  }

  let typewriterTimeouts = [];
  let isLetterTyping = false;

  function clearTypewriterTimeouts() {
    typewriterTimeouts.forEach(clearTimeout);
    typewriterTimeouts = [];
  }

  function addTypewriterTimeout(fn, delay) {
    const id = setTimeout(fn, delay);
    typewriterTimeouts.push(id);
    return id;
  }

  birthdayEnvelope.addEventListener("click", () => {
    if (birthdayEnvelope.classList.contains("open")) return;
    
    birthdayEnvelope.classList.add("open");
    envelopePrompt.style.opacity = "0";

    // Envelope unfold transition: wait and present typing letter
    addTypewriterTimeout(() => {
      // Smoothly collapse the envelope container height & opacity
      envelopeContainer.classList.add("collapsed");
      
      // Smoothly expand and fade in the letter display card height & opacity
      loveLetterDisplay.classList.add("visible");
      
      addTypewriterTimeout(() => {
        startTypewriter();
      }, 1200); // Wait for height morph to fully complete
    }, 1500); // Wait for flap and sheet pull animation to reach peak
  });

  function startTypewriter() {
    clearTypewriterTimeouts();
    isLetterTyping = true;
    
    const letterData = CONFIG.letter;
    typewriterContent.innerHTML = "";
    
    let currentParagraphIdx = 0;
    
    function typeNextParagraph() {
      if (!isLetterTyping) return;
      if (currentParagraphIdx < letterData.paragraphs.length) {
        const text = letterData.paragraphs[currentParagraphIdx];
        const paraEl = document.createElement("div");
        paraEl.className = "letter-para";
        typewriterContent.appendChild(paraEl);
        
        let charIdx = 0;
        const cursor = document.createElement("span");
        cursor.className = "typing-cursor";
        paraEl.appendChild(cursor);
        
        paraEl.classList.add("visible");
        
        function typeChar() {
          if (!isLetterTyping) return;
          if (charIdx < text.length) {
            cursor.before(text.charAt(charIdx));
            charIdx++;
            
            // Varied spelling delay for realistic handtyping feel
            let speed = 25;
            if (text.charAt(charIdx - 1) === ',' || text.charAt(charIdx - 1) === '.') {
              speed = 350; // Breathing pause
            } else if (text.charAt(charIdx - 1) === ' ') {
              speed = 10;
            }
            
            addTypewriterTimeout(typeChar, speed);
          } else {
            // Finished paragraph, cleanup cursor and load next
            cursor.remove();
            currentParagraphIdx++;
            addTypewriterTimeout(typeNextParagraph, 600);
          }
        }
        typeChar();
      } else {
        // Type Signature
        const sigEl = document.createElement("span");
        sigEl.className = "letter-signature";
        typewriterContent.appendChild(sigEl);
        
        let sigText = letterData.signature;
        let sigCharIdx = 0;
        const sigCursor = document.createElement("span");
        sigCursor.className = "typing-cursor";
        sigEl.appendChild(sigCursor);
        
        function typeSignature() {
          if (!isLetterTyping) return;
          if (sigCharIdx < sigText.length) {
            sigCursor.before(sigText.charAt(sigCharIdx));
            sigCharIdx++;
            addTypewriterTimeout(typeSignature, 40);
          } else {
            sigCursor.remove();
            isLetterTyping = false;
            celebrationTriggerContainer.style.display = "block";
          }
        }
        typeSignature();
      }
    }
    
    addTypewriterTimeout(typeNextParagraph, 500);
  }

  // Click anywhere on letter card to skip typing animation
  loveLetterDisplay.addEventListener("click", () => {
    if (isLetterTyping) {
      clearTypewriterTimeouts();
      isLetterTyping = false;
      
      typewriterContent.innerHTML = "";
      const letterData = CONFIG.letter;
      
      // Render all paragraphs instantly
      letterData.paragraphs.forEach(text => {
        const paraEl = document.createElement("div");
        paraEl.className = "letter-para visible";
        paraEl.textContent = text;
        typewriterContent.appendChild(paraEl);
      });
      
      // Render signature instantly
      const sigEl = document.createElement("span");
      sigEl.className = "letter-signature";
      sigEl.textContent = letterData.signature;
      typewriterContent.appendChild(sigEl);
      
      // Show stage completion trigger
      celebrationTriggerContainer.style.display = "block";
    }
  });

  document.getElementById("btn-to-celebration").addEventListener("click", () => {
    navigateTo("screen-celebration");
  });

  // --- 8. BIRTHDAY CAKE & FLAME EXTINGUISHING ---
  const cake = document.getElementById("birthday-cake");
  const candles = cake.querySelectorAll(".candle");
  const finalContainer = document.getElementById("final-hug-container");

  candles.forEach(candle => {
    candle.addEventListener("click", (e) => {
      e.stopPropagation(); // Avoid triggering full cake events
      if (candle.classList.contains("blown-out")) return;
      
      candle.classList.add("blown-out");
      appState.candlesLit--;

      // Single candle extinguishing burst particle simulation
      triggerCandleExtinguishExplosion(candle);

      if (appState.candlesLit === 0) {
        // Trigger Canvas Confetti celebration
        startConfetti();
        
        // Show final emotional block
        finalContainer.style.opacity = "1";
        cake.querySelector(".cake-instructions").textContent = "🎮 QUEST COMPLETED! ❤️";
      }
    });
  });

  // --- 9. HIGH PERFORMANCE CANVAS CONFETTI ENGINE ---
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let confettiParticles = [];
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener("resize", resizeCanvas);
  
  const colors = [
    "#ff5e97", "#ff2e93", "#ffd700", "#a855f7", 
    "#6366f1", "#10b981", "#3b82f6", "#f59e0b"
  ];
  
  class ConfettiParticle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height - 20;
      this.size = Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speed = Math.random() * 4 + 3;
      this.density = Math.random() * 20 + 10;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.opacity = Math.random() * 0.2 + 0.8;
      this.drift = Math.random() * 2 - 1;
    }
    
    update() {
      this.y += this.speed;
      this.x += this.drift;
      this.rotation += this.rotationSpeed;
      
      // Soft drift swing
      this.drift += Math.sin(this.y / 30) * 0.05;
      
      // Respawn or limit boundary
      if (this.y > canvas.height) {
        this.y = -20;
        this.x = Math.random() * canvas.width;
        this.speed = Math.random() * 4 + 3;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Draw rectangular confetti ribbons
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  function triggerCandleExtinguishExplosion(candleElement) {
    // Generate a quick splash of glowing particles around the candle tip
    const rect = candleElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top;

    resizeCanvas();

    for (let i = 0; i < 25; i++) {
      const p = new ConfettiParticle();
      p.x = startX;
      p.y = startY;
      // Explode outwards
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 4;
      p.drift = Math.cos(angle) * speed;
      p.speed = Math.sin(angle) * speed - 2; // initial upward kick
      p.opacity = 1.0;
      
      // Custom short life update
      const baseUpdate = p.update;
      p.update = function() {
        this.x += this.drift;
        this.y += this.speed;
        this.speed += 0.15; // gravity
        this.opacity -= 0.02; // fade
        if (this.opacity <= 0) {
          // Remove custom update index
          const idx = confettiParticles.indexOf(this);
          if (idx > -1) confettiParticles.splice(idx, 1);
        }
      };
      
      confettiParticles.push(p);
    }

    if (!appState.confettiActive) {
      animateConfettiLoop();
    }
  }
  
  function startConfetti() {
    resizeCanvas();
    confettiParticles = [];
    appState.confettiActive = true;
    
    // Spawn 150 normal confetti flakes
    for (let i = 0; i < 150; i++) {
      confettiParticles.push(new ConfettiParticle());
    }
    
    animateConfettiLoop();
    
    // Gracefully slow down spawning after 8 seconds
    setTimeout(() => {
      appState.confettiActive = false;
    }, 8000);
  }
  
  function animateConfettiLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiParticles.forEach((p, idx) => {
      p.update();
      p.draw();
      
      // Stop looping inactive particles if generator is shut off
      if (!appState.confettiActive && p.y < 0) {
        confettiParticles.splice(idx, 1);
      }
    });
    
    if (confettiParticles.length > 0) {
      requestAnimationFrame(animateConfettiLoop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // --- 10. REPLAY / RESET ENGINE ---
  document.getElementById("btn-replay-future").addEventListener("click", () => {
    // Reset state
    appState.quizScore = 0;
    appState.quizIndex = 0;
    appState.activePhotoIndex = 0;
    appState.candlesLit = 3;
    maxMemoriesViewed = 0;
    appState.q4Clicks = 0;

    // Reset candles UI
    candles.forEach(candle => {
      candle.classList.remove("blown-out");
    });
    document.getElementById("birthday-cake").querySelector(".cake-instructions").textContent = "🕯️ Blow out the laser candles!";
    finalContainer.style.opacity = "0";

    // Reset letter UI
    clearTypewriterTimeouts();
    isLetterTyping = false;
    birthdayEnvelope.classList.remove("open");
    birthdayEnvelope.style.transition = ""; // Clear transition values
    birthdayEnvelope.style.opacity = "1";
    birthdayEnvelope.style.transform = "scale(1) translateY(0)";
    envelopeContainer.classList.remove("collapsed");
    envelopePrompt.style.opacity = "1";
    loveLetterDisplay.classList.remove("visible");
    typewriterContent.innerHTML = "";
    celebrationTriggerContainer.style.display = "none";

    // Navigate to beginning
    navigateTo("screen-welcome");
  });

  // --- 11. PREMIUM FULL-SCREEN LIGHTBOX MODAL ---
  const lightboxModal = document.getElementById("lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(imgSrc, captionText) {
    lightboxImg.src = imgSrc;
    lightboxCaption.textContent = captionText || "";
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }

  function closeLightbox() {
    lightboxModal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Attach Lightbox triggers to Gallery Polaroids in Stage 3
  const polaroidDeckEl = document.getElementById("polaroid-deck");
  if (polaroidDeckEl) {
    polaroidDeckEl.addEventListener("click", (e) => {
      const card = e.target.closest(".polaroid-card");
      if (card) {
        const img = card.querySelector(".polaroid-img");
        const caption = card.querySelector(".polaroid-caption");
        if (img) {
          openLightbox(img.src, caption ? caption.textContent : "");
        } else {
          // If placeholder card
          const placeholder = card.querySelector(".polaroid-placeholder span");
          if (placeholder) {
            openLightbox("cute_cats.png", "You are perfect! ❤️");
          }
        }
      }
    });
  }
  // Attach Lightbox triggers to Scrapbook polaroids in Stage 6
  document.querySelectorAll(".scrapbook-polaroid").forEach(card => {
    card.addEventListener("click", () => {
      const img = card.querySelector(".polaroid-photo");
      const captionEl = card.querySelector(".polaroid-caption");
      const type = card.dataset.type;
      if (img) {
        let caption = "";
        if (captionEl) {
          caption = captionEl.textContent;
        } else {
          // Fallback based on card type
          if (type === "sajal-now") caption = "Sajal — Now ❤️";
          else if (type === "aditi-now") caption = "Aditi — Now 💖";
        }
        openLightbox(img.src, caption);
      }
    });
  });

});
