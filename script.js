// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Build film roll
const filmTrack = document.getElementById("dynamic-film-track");
if (filmTrack && typeof filmRollImages !== 'undefined') {
    // Add images twice to ensure infinite scroll fills
    const allImages = [...filmRollImages, ...filmRollImages];
    allImages.forEach(src => {
        const frame = document.createElement("div");
        frame.className = "film-frame";
        frame.innerHTML = `<div class="frame-content" style="padding:0;"><img loading="lazy" src="${src}" style="width:100%; height:100%; object-fit:cover;"></div>`;
        filmTrack.appendChild(frame);
    });
}

const retroColors = ["#8b5a2b", "#8b3a3a", "#4a6fa5", "#556b2f", "#b38b22", "#666666"];

// Modal Elements
const modal = document.getElementById("memory-modal");
const closeBtn = document.querySelector(".close-btn");
const cards = document.querySelectorAll(".memory-card");

const modalTitle = document.getElementById("modal-title");
const modalCaption = document.getElementById("modal-caption");
const modalDescription = document.getElementById("modal-description");
const modalHeader = document.querySelector(".modal-header");

// Carousel Elements
const carouselTrack = document.getElementById("carousel-track");
const prevBtn = document.getElementById("carousel-prev");
const nextBtn = document.getElementById("carousel-next");
let currentSlide = 0;
let totalSlides = 0;

function updateCarousel() {
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
        if (totalSlides > 0) {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (totalSlides > 0) {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }
    });
}

function openModal(id) {
    const data = memoryData[id];
    const color = retroColors[(id - 1) % retroColors.length];

    modalTitle.textContent = `#${id} - ${data.title}`;
    modalCaption.textContent = `"${data.caption}"`;
    modalDescription.textContent = data.description;

    // Inject Carousel Images
    carouselTrack.innerHTML = "";
    if (data.images && data.images.length > 0) {
        data.images.forEach(imgSrc => {
            const slide = document.createElement("div");
            slide.classList.add("carousel-slide");
            slide.innerHTML = `<img src="${imgSrc}" alt="Memory image">`;
            carouselTrack.appendChild(slide);
        });
        totalSlides = data.images.length;
        currentSlide = 0;
        updateCarousel(); // reset position

        // Hide arrows if only 1 image
        prevBtn.style.display = totalSlides > 1 ? "block" : "none";
        nextBtn.style.display = totalSlides > 1 ? "block" : "none";
    } else {
        totalSlides = 0;
    }

    modalHeader.style.background = color;

    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "flex-start";
    modal.style.paddingTop = "5%";

    // Explicit GSAP FromTo ensures that it resets properly from zero alpha. 
    // This stops it from instantly dissolving/disappearing if clicked multiple times!
    gsap.fromTo(".modal-content",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.2)" }
    );
}

// Attach clicks to archive cards
cards.forEach(card => {
    card.addEventListener("click", (e) => {
        e.stopPropagation(); // Avoid parent event triggers affecting rendering speed
        const id = card.getAttribute("data-id");
        openModal(id);
    });
});

if (closeBtn) {
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ----------------------------------------------------
// Global Audio Player Element (Gramophone)
// ----------------------------------------------------
const musicToggle = document.getElementById("music-toggle");
const bgMusic = document.getElementById("bg-music");
const recordIcon = document.getElementById("record-icon");
const musicText = document.getElementById("music-text");

let isPlaying = false;

if (musicToggle && bgMusic) {
    musicToggle.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            recordIcon.classList.remove("playing");
            musicText.textContent = "Play Music";
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed / waiting on interaction", e));
            recordIcon.classList.add("playing");
            musicText.textContent = "Pause Music";
        }
        isPlaying = !isPlaying;
    });
}

// ----------------------------------------------------
// Rotary Dial Logic
// ----------------------------------------------------
const rotaryPlate = document.getElementById("rotary-plate");
const spinBtn = document.getElementById("spin-btn");
let currentRotation = 0;
let isDialing = false;

if (spinBtn && rotaryPlate) {
    spinBtn.addEventListener("click", () => {
        if (isDialing) return;
        isDialing = true;

        // Choose a random memory (1 to 6)
        const selection = Math.floor(Math.random() * 6) + 1;

        const forwardAngles = [70, 130, 190, 250, 310, 360];
        const pullAmount = forwardAngles[selection - 1] + 720;

        // Play "pull" animation
        rotaryPlate.style.transition = "transform 1.0s cubic-bezier(0.25, 0.1, 0.25, 1)";
        rotaryPlate.style.transform = `rotate(${currentRotation + pullAmount}deg)`;

        setTimeout(() => {
            // "Spring back" to base gently
            let springBackTime = 1.0 + (selection * 0.1);
            rotaryPlate.style.transition = `transform ${springBackTime}s cubic-bezier(0.1, 0.8, 0.2, 1)`;
            rotaryPlate.style.transform = `rotate(${currentRotation}deg)`;

            // After spring back, open modal
            setTimeout(() => {
                isDialing = false;

                // Automatically scroll the horizontal slider to the selected folder
                const targetCard = document.querySelector(`.memory-card[data-id="${selection}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }

                openModal(selection);
            }, springBackTime * 1000 + 100);

        }, 1100);
    });
}

// ----------------------------------------------------
// Scroll Animations
// ----------------------------------------------------

gsap.utils.toArray(".timeline-node").forEach(node => {
    gsap.from(node, {
        scrollTrigger: {
            trigger: node,
            start: "top 85%"
        },
        x: node.classList.contains("left") ? -50 : 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
});

// ----------------------------------------------------
// Final Section: Confetti & 'Brighter Dark' Finale
// ----------------------------------------------------
const pressThisBtn = document.getElementById("press-this-btn");
const popperSection = document.getElementById("popper-finale");
const sparkleOverlay = document.getElementById("sparkle-overlay");

function generateSparkles() {
    // Generate 50 random sparkly stars
    for (let i = 0; i < 50; i++) {
        let star = document.createElement("div");
        star.classList.add("sparkle-star");
        // Random position
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";

        // Random twinkle animation duration between 1.5s and 4.0s
        let duration = Math.random() * 2.5 + 1.5;
        star.style.animationDuration = duration + "s";
        star.style.animationDelay = (Math.random() * 2) + "s";

        sparkleOverlay.appendChild(star);
    }
}

if (pressThisBtn && popperSection) {
    pressThisBtn.addEventListener("click", () => {

        // Fire canvas confetti library (pure colours, no emojis)
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 120,
                origin: { y: 0.6 },
                colors: ["#ff3366", "#33ccff", "#ffff66", "#cc33ff", "#ffffff"],
                disableForReducedMotion: true
            });
        }

        // Transform the section dynamically
        popperSection.classList.add("color-burst");

        // Populate and fade in the sparkly stars
        generateSparkles();

        // Swap out the header texts to the exact phrase requested
        const headerText = popperSection.querySelector('#popper-title');
        if (headerText) {
            headerText.textContent = "Your memories bring colours.";
        }

        // Hide paragraph descriptions
        const desc = document.getElementById("popper-desc");
        const reminder = document.getElementById("popper-reminder");
        if (desc) desc.style.display = "none";
        if (reminder) reminder.style.display = "none";

        // Hide the button once clicked so it's a seamless ending
        pressThisBtn.style.display = "none";

        // Show goodbye floating polaroid object
        const goodbye = document.getElementById("goodbye-container");
        if (goodbye) {
            goodbye.classList.remove("hidden-burst");
            goodbye.classList.add("show-goodbye");
        }

    });
}

// --- Private Messaging System Logic ---
(function () {
    var passwords = {
        preshmi: "Preshmi@123",
        josna: "Josna@123",
        alpha: "Alpha@123",
        abitha: "Abitha@123",
        arpitha: "Arpitha@123"
    };

    var currentRecipient = null;
    var msgModal = document.getElementById('msg-modal');
    var passwordView = document.getElementById('password-view');
    var inboxView = document.getElementById('inbox-view');
    var passwordInput = document.getElementById('password-input');
    var unlockBtn = document.getElementById('unlock-btn');
    var passwordError = document.getElementById('password-error');
    var messageList = document.getElementById('message-list');
    var closeMsgBtn = document.getElementById('close-msg-modal');
    var togglePasswordBtn = document.getElementById('toggle-password');

    if (!msgModal || !unlockBtn) {
        console.warn('Messaging modal elements not found.');
        return;
    }

    // Migration logic for one-time move of local data to Firebase
    async function migrateLocalStorageToFirebase() {
        const localMsgs = localStorage.getItem('farewell_messages');
        const localUnread = localStorage.getItem('unread_counts');

        if (localMsgs) {
            try {
                const msgs = JSON.parse(localMsgs);
                const promises = [];
                Object.keys(msgs).forEach(recipient => {
                    msgs[recipient].forEach(msg => {
                        // Push to cloud and track the promise
                        promises.push(database.ref('farewell_messages/' + recipient).push(msg));
                    });
                });

                // Wait for ALL messages to be safely in the cloud
                if (promises.length > 0) {
                    await Promise.all(promises);
                    localStorage.removeItem('farewell_messages');
                    console.log("Messages successfully migrated to Firebase.");
                }
            } catch (e) {
                console.warn("Migration to Firebase failed or partially failed. Local data preserved.", e);
            }
        }

        if (localUnread) {
            try {
                const unread = JSON.parse(localUnread);
                const unreadPromises = [];
                Object.keys(unread).forEach(recipient => {
                    unreadPromises.push(database.ref('unread_counts/' + recipient).set(unread[recipient]));
                });
                await Promise.all(unreadPromises);
                localStorage.removeItem('unread_counts');
            } catch (e) { }
        }
    }

    migrateLocalStorageToFirebase();

    function updateBadges() {
        database.ref('unread_counts').on('value', (snapshot) => {
            const unread = snapshot.val() || {};
            const people = Object.keys(passwords);
            for (let i = 0; i < people.length; i++) {
                const person = people[i];
                const badge = document.getElementById('badge-' + person);
                if (badge) {
                    const count = unread[person] || 0;
                    badge.innerText = count;
                    if (count > 0) {
                        badge.classList.add('active');
                    } else {
                        badge.classList.remove('active');
                    }
                }
            }
        });
    }

    // Open envelope
    var envelopeItems = document.querySelectorAll('.envelope-item');
    for (var i = 0; i < envelopeItems.length; i++) {
        (function (item) {
            item.addEventListener('click', function () {
                currentRecipient = item.getAttribute('data-person');
                passwordView.style.display = 'block';
                inboxView.style.display = 'none';
                passwordInput.value = '';
                passwordError.style.display = 'none';
                var name = currentRecipient.charAt(0).toUpperCase() + currentRecipient.slice(1);
                document.getElementById('msg-modal-title').innerText = "Unlock " + name + "'s Letters";
                msgModal.classList.add('show');
            });
        })(envelopeItems[i]);
    }

    // Unlock
    unlockBtn.addEventListener('click', function () {
        var entered = passwordInput.value.trim();
        if (entered === passwords[currentRecipient]) {
            showInbox();
            // Clear unread count in Firebase for this recipient
            database.ref('unread_counts/' + currentRecipient).set(0);
        } else {
            passwordError.style.display = 'block';
        }
    });

    passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') unlockBtn.click();
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function () {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            passwordInput.type = 'password';
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    });

    function showInbox() {
        passwordView.style.display = 'none';
        inboxView.style.display = 'block';
        const name = currentRecipient.charAt(0).toUpperCase() + currentRecipient.slice(1);
        document.getElementById('inbox-title').innerText = name + "'s Inbox";

        messageList.innerHTML = '<div class="no-messages">Loading letters...</div>';

        // Listen for messages for this specific recipient in real-time
        database.ref('farewell_messages/' + currentRecipient).on('value', (snapshot) => {
            const data = snapshot.val();
            const myMessages = data ? Object.values(data) : [];

            messageList.innerHTML = '';
            if (myMessages.length === 0) {
                messageList.innerHTML = '<div class="no-messages">No letters in your postbox yet.</div>';
                return;
            }

            const reversed = myMessages.slice().reverse();
            reversed.forEach((msg) => {
                const card = document.createElement('div');
                card.className = 'message-card';
                card.style.cursor = 'pointer';
                let html = '';
                const msgType = msg.type || 'text';

                if (msgType === 'image' && msg.mediaData) {
                    html += `<div class="msg-media"><img src="${msg.mediaData}" style="max-width:100%;max-height:100px;border-radius:4px;object-fit:cover;"></div>`;
                } else if (msgType === 'audio' && msg.mediaData) {
                    html += `<div class="msg-media" style="pointer-events:none;"><audio style="width:100%;height:30px;"><source src="${msg.mediaData}"></audio></div>`;
                } else if (msgType === 'video' && msg.mediaData) {
                    html += `<div class="msg-media"><video style="max-width:100%;max-height:80px;border-radius:4px;pointer-events:none;"><source src="${msg.mediaData}"></video></div>`;
                }
                if (msg.text) {
                    const preview = msg.text.length > 80 ? msg.text.substring(0, 80) + '...' : msg.text;
                    html += `<div class="msg-text">${preview}</div>`;
                }
                html += `<div class="msg-footer"><div class="msg-sender">- ${msg.from}</div></div>`;
                card.innerHTML = html;

                card.addEventListener('click', () => {
                    showFullMessage(msg);
                });
                messageList.appendChild(card);
            });
        });
    }

    function showFullMessage(msg) {
        messageList.innerHTML = '';
        var wrapper = document.createElement('div');

        var backBtn = document.createElement('button');
        backBtn.className = 'vintage-btn-outline';
        backBtn.style.cssText = 'margin-bottom:1.5rem;padding:0.6rem 1.5rem;font-size:0.9rem;';
        backBtn.innerHTML = '&larr; Back to Inbox';
        backBtn.addEventListener('click', function () { showInbox(); });

        var content = document.createElement('div');
        var html = '';
        var msgType = msg.type || 'text';

        if (msgType === 'image' && msg.mediaData) {
            html += '<div class="msg-media" style="margin-bottom:1rem;"><img src="' + msg.mediaData + '" style="max-width:100%;border-radius:4px;box-shadow:0 4px 15px rgba(0,0,0,0.15);"></div>';
        } else if (msgType === 'audio' && msg.mediaData) {
            html += '<div class="msg-media" style="margin-bottom:1rem;"><audio controls style="width:100%;"><source src="' + msg.mediaData + '"></audio></div>';
        } else if (msgType === 'video' && msg.mediaData) {
            html += '<div class="msg-media" style="margin-bottom:1rem;"><video controls style="max-width:100%;border-radius:4px;box-shadow:0 4px 15px rgba(0,0,0,0.15);"><source src="' + msg.mediaData + '"></video></div>';
        }
        if (msg.text) {
            html += '<div class="msg-text" style="white-space:pre-wrap;line-height:1.8;font-size:1.05rem;">' + msg.text + '</div>';
        }
        html += '<div class="msg-footer" style="margin-top:1.5rem;padding-top:1rem;border-top:1px dashed #ccc;"><div class="msg-sender" style="font-size:1.6rem;">- Regards, ' + msg.from + '</div></div>';
        content.innerHTML = html;

        wrapper.appendChild(backBtn);
        wrapper.appendChild(content);
        messageList.appendChild(wrapper);
    }

    // Close
    closeMsgBtn.addEventListener('click', function () {
        msgModal.classList.remove('show');
        // Stop listening to messages when modal closes to save resources
        if (currentRecipient) {
            database.ref('farewell_messages/' + currentRecipient).off();
        }
    });
    msgModal.addEventListener('click', function (e) {
        if (e.target === msgModal) {
            msgModal.classList.remove('show');
            if (currentRecipient) {
                database.ref('farewell_messages/' + currentRecipient).off();
            }
        }
    });

    updateBadges();
})();

