import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function AboutUs() {
  return (
    <>
      <div className="container">
        <div className="header-container">
          <h1>About Us</h1>
          <a href="#about-container">
            <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
          </a>
          <img src="/assets/images/banner8.png" alt=""></img>
        </div>

        <div className="about-container" id="about-container">
          <div className="first-container">
            <div className="first-text-container">
              <h2>Welcome to the FreeLancers Team Page!</h2>
              <p>
                We are a dynamic and experienced group crafting innovative
                solutions every day using React, JavaScript, SCSS, npm packages,
                and various API integrations. Our strengths include:
              </p>
              <ul>
                <li>
                  High level of professionalism in designing and developing
                  React components.
                </li>
                <li>Rapid iteration using the modern JavaScript ecosystem.</li>
                <li>Clear and maintainable SCSS modular style structure.</li>
                <li>Excellent team collaboration and knowledge sharing.</li>
                <li>Quick responsiveness and adaptability to project needs.</li>
              </ul>
            </div>
            <img src="/assets/images/FreeLancers5.png" alt=""></img>
          </div>
          <div className="second-container">
            <div className="second-text-container">
              <h2>More about Read · Y</h2>
              <p>
                Read · Y is a sleek digital reading platform that turns every
                page into an inspiring journey. Store and organize all your
                e-books in a personal library, then highlight passages and
                instantly extract them into editable annotations. Jot down your
                thoughts, questions or insights alongside the text—all securely
                saved in our cloud database. Track your reading progress,
                challenge yourself with weekly or monthly goals, and build a
                personalized record of your literary adventures. With Read · Y,
                effortless reading meets deeper engagement.
                <p>
                  We would highly appreciate your support, click{" "}
                  <a target="_blank" href="https://contribee.com/free-lancers">
                    here
                  </a>{" "}
                  to buy us a coffee!
                </p>
              </p>
            </div>
            <img src="/assets/images/ReadY5.png" alt=""></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
