"use strict";

const keyboardDownIcon = `
  <svg class="keyboardDown" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01825 0.336173L6.59114 4.80281L11.164 0.336173C11.2731 0.229593 11.4027 0.14505 11.5453 0.0873692C11.6878 0.0296886 11.8406 1.123e-09 11.9949 0C12.1492 -1.123e-09 12.302 0.0296886 12.4446 0.0873692C12.5872 0.14505 12.7167 0.229593 12.8258 0.336173C12.9349 0.442753 13.0215 0.569281 13.0806 0.708534C13.1396 0.847788 13.17 0.997038 13.17 1.14776C13.17 1.29849 13.1396 1.44774 13.0806 1.587C13.0215 1.72625 12.9349 1.85278 12.8258 1.95936L7.41615 7.24334C7.30711 7.35006 7.1776 7.43473 7.03502 7.4925C6.89245 7.55026 6.73961 7.58 6.58525 7.58C6.43089 7.58 6.27805 7.55026 6.13548 7.4925C5.9929 7.43473 5.86339 7.35006 5.75435 7.24334L0.344668 1.95936C0.23541 1.85286 0.148728 1.72635 0.0895853 1.58709C0.0304424 1.44782 0 1.29853 0 1.14776C0 0.996995 0.0304424 0.847705 0.0895853 0.708441C0.148728 0.569177 0.23541 0.442674 0.344668 0.336173C0.804315 -0.101281 1.55861 -0.112793 2.01825 0.336173V0.336173Z" fill="#7C7C7C"/>
  </svg>
`;

const moreIcon = `
  <svg width="4" height="15" viewBox="0 0 4 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.00033 1.72222C1.00033 2.12109 1.37342 2.44444 1.83366 2.44444C2.2939 2.44444 2.66699 2.12109 2.66699 1.72222C2.66699 1.32335 2.2939 1 1.83366 1C1.37342 1 1.00033 1.32335 1.00033 1.72222Z" stroke="#7C7C7C" stroke-width="2"/>
    <path d="M0.999837 7.50005C0.999837 7.89893 1.37293 8.22228 1.83317 8.22228C2.29341 8.22228 2.6665 7.89893 2.6665 7.50005C2.6665 7.10118 2.29341 6.77783 1.83317 6.77783C1.37293 6.77783 0.999837 7.10118 0.999837 7.50005Z" stroke="#7C7C7C" stroke-width="2"/>
    <path d="M0.999837 13.2776C0.999837 13.6765 1.37293 13.9999 1.83317 13.9999C2.29341 13.9999 2.6665 13.6765 2.6665 13.2776C2.6665 12.8788 2.29341 12.5554 1.83317 12.5554C1.37293 12.5554 0.999837 12.8788 0.999837 13.2776Z" stroke="#7C7C7C" stroke-width="2"/>
    </svg>
`;

async function flightInfo(query) {
  return `
    <style>
      :root {
        --cultured: #f3f4f6;
        --white: #ffffff;
        --light-white: #fbfbfb;
        --gray-web: #7C7C7C;
        --gray-web-dark: #555555;
        --primary: #359ed8;
        --bluetiful: #0066FF;
        --border: 1px solid #e5e5e5;
        --jet-brown: #2e2e2e;
        --jet-brown-lighter: #2d2e31;
        --eerie-black: #202124;
        --sea-green: #4fb66e;
        --silver-sand: #c2c3c6;
      }

      * {
        padding: 0;
        margin: 0;
      }

      .font-medium {
        font-weight: 500;
      }

      .Text {
        font-size: 0.9rem;
      }

      .Text--subtle {
        color: #7C7C7C;
      }

      .Package-wrapper {
        width: 100%;
        flex: 1;
        min-height: 90vh;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        background: var(--jet-brown);
        padding: 1rem 2rem;
      }

      .Card {
        padding: 1rem;
        background: var(--eerie-black);
        min-width: 700px;
        width: 700px;
        color: var(--silver-sand);
        padding-right: 2rem;
      }

      .Card--header {
        display: flex;
        justify-content: space-between;
      }

      .Card--heading {
        font-size: 1.2rem;
        margin-top: 0;
        margin-bottom: 0.5rem;
      }

      .Card-Tabs {
        margin-top: 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: row;
      }

      .TabsWrapper {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        margin-top: 0.5rem;
      }

      .TabsWrapper-header {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-direction: row;
      }

      .Tab {
        position: relative;
        display: flex;
        flex-direction: row;
        cursor: pointer;
        min-width: 40px;
        padding: 12px;
        margin-left: calc(-1 * 12px);
        margin-right: 12px;
        margin-bottom: calc(-1 * 1px);
        text-align: center;
      }

      .Tab--active::after {
        background-color: var(--silver-sand);
        height: 0;
        border-top: 4px solid var(--silver-sand);
        border-top-left-radius: 100%;
        border-top-right-radius: 100%;
      }

      .Tab::after {
        position: absolute;
        left: 0;
        bottom: 0;
        content: '';
        margin-top: 10px;
        width: calc(100% - 2*12px);
        background-color: transparent;
        margin-left: 12px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
      }

      .Content {
        width: 100%;
      }

      .Accordion {
        border-top: 1px solid var(--jet-brown-lighter);
        padding-right: 0.5rem;
      }

      .Accordion:nth-of-type(2) {
        border-bottom: 1px solid var(--jet-brown-lighter);
      }

      .Accordion--trigger {
        cursor: pointer;
        padding: 18px 0;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        font-size: 15px;
        transition: 0.4s;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .Accordion--infoWrapper {
        display: flex;
      }

      .Accordion--info {
        margin-right: 5rem;
      }

      .Accordion--info h3 {
        margin-bottom: 0.5rem;
      }

      .Accordion--body {
        padding: 0.8rem 0;
        display: none;
      }

      .FlightCard {
        flex: 1;
        min-height: 200px;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
        border: 1px solid var(--jet-brown-lighter);
      }

      .Button {
        border: none;
        background: transparent;
        border-radius: 2px;
        font-size: 0.8rem;
        font-weight: 600;
        padding: 4px 7px;
      }

      .Button--status {
        background: var(--sea-green);
      }
    </style>

    <div class="Package-wrapper">
      <div class="Card">
        <header>
          <div class="Card--header">
            <div>
              <h1 class="Card--heading">Delta DL 4028</h1>
              <small>2 flights found</small>
            </div>
            ${moreIcon}
          </div>

          <div class="TabsWrapper">
            <div class="TabsWrapper-header">
              <div class="Tab Tab--active" tabindex="0">
                <span class="Text Text--regular">Mon, Sep 29</span>
              </div>
              <div class="Tab" tabindex="-1">
                <span class="Text Text--regular">Tue, Sep 29</span>
              </div>
              <div class="Tab" tabindex="-1">
                <span class="Text Text--regular">Wed, Sep 29</span>
              </div>
              <div class="Tab" tabindex="-1">
                <span class="Text Text--regular">Thur, Sep 29</span>
              </div>
            </div>
          </div>
        </header>

        <div class="Content">
          <div class="Accordion">
            <div class="Accordion--trigger">
              <div class="Accordion--infoWrapper">
                <div class="Accordion--info">
                  <h3 class="">12:49 PM</h3>
                  <button class="Button Button--status">ON TIME</button>
                </div>
                <div class="Accordion--info">
                  <h3 class="">DL 4028</h3>
                  <span>
                    <span class="Text font-medium">Louisville</span>
                    <span class="Text Text--subtle">SDF</span>
                  </span>
                </div>
              </div>
              ${keyboardDownIcon}
            </div>
          </div>
          <div class="Accordion--body">
            <div class="FlightCard">

            </div>
          </div>

          <div class="Accordion">
            <div class="Accordion--trigger">
              <div class="Accordion--infoWrapper">
                <div class="Accordion--info">
                  <h3 class="">12:49 PM</h3>
                  <button class="Button Button--status">ON TIME</button>
                </div>
                <div class="Accordion--info">
                  <h3 class="">DL 4028</h3>
                  <span>
                    <span class="Text font-medium">Louisville</span>
                    <span class="Text Text--subtle">SDF</span>
                  </span>
                </div>
              </div>
              ${keyboardDownIcon}
            </div>
          </div>
          <div class="Accordion--body">
            <div class="FlightCard">

            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      var acc = document.getElementsByClassName("Accordion");

      for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
          this.classList.toggle("active");
          var AccordionBody = this.nextElementSibling;
          if (AccordionBody.style.display === "block") {
            AccordionBody.style.display = "none";
          } else {
            AccordionBody.style.display = "block";
          }
        });
      }
    </script>

  `;
}

async function trigger(query) {
  return query === "foo" ? true : false;
}

module.exports = { flightInfo, trigger };
