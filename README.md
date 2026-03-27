# Sayonara Seniors - Retro Farewell Platform

A highly interactive, retro-themed digital farewell experience crafted specifically for the passing batch of 2022-2026. This project was designed to evoke nostalgia, resembling an old-school archive of memories complete with film grain, sepia tones, and interactive vintage elements.

## Features

- **Interactive Rotary Dial Archives:** A meticulously animated CSS/JS rotary telephone dial that lets users spin to randomly select folders of memories.
- **Infinite Film Strip:** A custom, continuously scrolling horizontal film strip displaying over 70 images dynamically loaded into the DOM.
- **Encrypted Private Messaging:** A password-protected digital envelope system allowing seniors to read personal goodbye letters and view media securely.
- **Cinematic Video Projection:** An integrated memory lane video frame, styled to resemble a projector screen in a dimly lit cinema.
- **Nostalgic Timeline:** A vertical timeline chronicling the journey from 2022 to graduation.
- **Magical Finale Screen:** A transition-heavy "popper" finale that bursts the monochrome retro theme into a brilliant midnight blue starry sky with dynamic confetti and floating polaroids.
- **Ambient Audio:** Built-in floating vintage gramophone player for loopable background music.

## Tech Stack

This project is built using universally supported frontend web technologies with no backend overhead, allowing it to be hosted statically anywhere.

- **HTML5:** Semantic architecture focusing on accessibility and DOM manipulation efficiency.
- **CSS3:** Extensive use of CSS animations, pseudo-elements, and keyframes. The CSS is split into multiple highly structured modules (e.g., `landing.css`, `video.css`, `timeline.css`, `finale.css`) to ensure maintainability.
- **Vanilla JavaScript:** Powers the modular data generation, password decryption, complex rotary math, and state handling.
- **GSAP (GreenSock):** Used for advanced `ScrollTrigger` based reveal animations on the timeline.
- **Canvas Confetti:** Third-party library utilized strictly for the finale particle burst.

## Setup and Running

Since this is a client-side static web application, there is no convoluted build process or package management required.

1. Clone or download the repository.
2. Ensure you have the localized media resources structure intact:
   - `farewell_images/` - Containing subdirectories like `the_gang`, `college_events`, etc.
   - `music.mp3` - Background gramophone audio.
   - *Note: The Memory Lane video is externally hosted on Google Drive for performance and storage efficiency.*
3. Open `index.html` in any modern web browser (Google Chrome, Firefox, Safari).

## Project Structure

The codebase is split into modular components for easier scalability and management:

- `index.html` - The core application document.
- `script.js` - Handling interactivity, the rotary telephone math, modal rendering, and visual transitions.
- `data.js` - Dedicated data store containing all the relative paths for image dynamic generation.
- `style.css` - The central hub loading all of the modularized stylesheets via `@import`.
- `global.css` - Root spacing, vintage typography (`Courier Prime`, `Playfair Display`), and the global film grain filter.

## Roadmap & Future Enhancements

- Integrate a lightweight backend (Firebase or Supabase) to allow live commenting on images.
- Optimize high-res image loading through lazy-load APIs and progressive JPEG blurring.
- Implement specialized mobile-view touch swiping for the rotary dial.

---

*Crafted with dedication for the class of 2026. "You can leave the hostel... but you can't leave the memories."*
