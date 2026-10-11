class ImageSlider { 
  constructor(boxSelector, photos) {                                   //Done by : Roshan Dhakal
    this.box = document.querySelector(boxSelector); // finds the slider box
    this.photos = photos; // saves the photo list
    this.total = photos.length; // counts the photos
    this.spot = 1; // place on the track, starts at 1 because a copy sits before the first photo
    this.isMoving = false; // stops extra clicks while a slide is running
    this.toastTimer = null; // remembers the message timer
    this.track = this.box.querySelector(".slider-track"); // the moving strip
    this.numberRow = this.box.querySelector(".page-numbers"); // the row for numbers
    this.toast = this.box.querySelector(".toast"); // the pop-up message
    this.renderImages(); // puts the photos on the track
    this.createIndicators(); // makes the numbered buttons
    this.attachEvents(); // connects clicks and animation events
    this.jumpTo(1); // starts at photo one with no animation
  }                                                                 // Done by : Roshan Dhakal

  get currentIndex() { return (this.spot - 1 + this.total) % this.total; } // real photo number even when a copy is showing
  renderImages() { // builds every slide from the list
    const makeSlide = (p) => `<figure class="slide"><img src="${p.file}" alt="${p.title}"><figcaption>${p.title}</figcaption></figure>`; // one slide written as text
    const allSlides = [this.photos[this.total - 1], ...this.photos, this.photos[0]]; // adds a copy of the last photo in front and the first photo at the back
    this.track.innerHTML = allSlides.map(makeSlide).join(""); // places all slides on the track
    this.track.firstElementChild.setAttribute("aria-hidden", "true"); // screen readers skip the front copy
    this.track.lastElementChild.setAttribute("aria-hidden", "true"); // screen readers skip the back copy
  } // renderImages ends
  createIndicators() { // builds the numbered buttons
    this.numberRow.innerHTML = this.photos.map((_, i) => `<button class="page-number" data-index="${i}">${i + 1}</button>`).join(""); // one button for each photo
    this.numberButtons = [...this.numberRow.children]; // keeps the buttons in a list
  }    // Done by : Roshan Dhakal
  attachEvents() { // connects everything in one place
    this.box.querySelector(".arrow-left").addEventListener("click", () => this.prevSlide()); // left arrow goes back
    this.box.querySelector(".arrow-right").addEventListener("click", () => this.nextSlide()); // right arrow goes forward
    this.numberRow.addEventListener("click", (e) => { // one listener handles all numbers
      const clicked = e.target.closest(".page-number"); // finds which number was clicked
      if (clicked) this.goToSlide(Number(clicked.dataset.index)); // moves to that photo
    }); 
    this.track.addEventListener("transitionend", (e) => { // runs when a slide finishes moving
      if (e.target === this.track) this.fixLoop(); // ignores the hover effects on photos
    }); 
  } 
// Done by : Roshan Dhakal
  updateSlider() { // moves the track and updates the numbers
    this.track.style.transform = `translateX(${-this.spot * 100}%)`; // slides left by whole frame widths
    this.numberButtons.forEach((b, i) => b.classList.toggle("active", i === this.currentIndex)); // only the current number looks active
  } 
// Done by : Roshan Dhakal
  moveBy(step) { // shared move for next and previous
    if (this.isMoving) return; // ignores clicks during a slide
    this.isMoving = true; // locks the buttons
    this.spot += step; // goes one place forward or back
    this.updateSlider(); // starts the slide
    this.showToast(this.photos[this.currentIndex].title); // shows the photo name
  } 

  nextSlide() { this.moveBy(1); } // one photo forward
  prevSlide() { this.moveBy(-1); } // one photo back
// Done by : Roshan Dhakal
  goToSlide(index) { // slides straight to a chosen photo
    if (this.isMoving || index === this.currentIndex) return; // stops if busy or already there
    this.isMoving = true; // locks the buttons
    this.spot = index + 1; // photo number becomes track place
    this.updateSlider(); // starts the slide
    this.showToast(this.photos[index].title); // shows the photo name
  } 
  fixLoop() { // runs after each slide
    this.isMoving = false; // buttons work again
    if (this.spot === 0) this.jumpTo(this.total); // front copy reached, so hop to the real last photo
    if (this.spot === this.total + 1) this.jumpTo(1); // back copy reached, so hop to the real first photo
  } 
  jumpTo(spot) { // moves without animation
    this.track.classList.add("no-anim"); // switches the animation off
    this.spot = spot; // sets the new place
    this.updateSlider(); // places the track instantly
    void this.track.offsetWidth; // forces the browser to apply the change
    this.track.classList.remove("no-anim"); // switches the animation back on
  } 
// Done by : Roshan Dhakal
  showToast(text) { // shows a short message
    this.toast.textContent = text; // writes the message
    this.toast.classList.add("show"); // slides it into view
    clearTimeout(this.toastTimer); // cancels any older timer
    this.toastTimer = setTimeout(() => this.toast.classList.remove("show"), 1600); // hides it after 1.6 seconds
  } 
} 