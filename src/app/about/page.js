import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

function AboutUs() {
  return (
    <>
      <div className="container">
        <div className="header-container">
          <h1>About Us</h1>
          <FontAwesomeIcon icon={faChevronDown} className="scroll-icon" />
          <img src="/assets/images/banner8.png" alt=""></img>
        </div>

        <div className="about-container">
          <div className="first-container">
            <div className="first-text-container">
              <h2>Lorem ipsum dolor sit amet</h2>
              <ul>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  nisl nisl, auctor id finibus sit amet, mattis nec justo. Sed
                  mauris diam
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  nisl nisl, auctor id finibus sit amet, mattis nec justo. Sed
                  mauris diam
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  nisl nisl, auctor id finibus sit amet, mattis nec justo. Sed
                  mauris diam
                </li>
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                  nisl nisl, auctor id finibus sit amet, mattis nec justo. Sed
                  mauris diam
                </li>
              </ul>
            </div>
            <img src="/assets/images/example.png" alt=""></img>
          </div>
          <div className="second-container">
            <div className="second-text-container">
              <h2>Lorem ipsum dolor sit amet</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                nisl nisl, auctor id finibus sit amet, mattis nec justo. Sed
                mauris diam, commodo ut lobortis et, sodales ac nisi. Duis
                volutpat consequat magna vel fringilla. Vivamus odio ipsum,
                feugiat vitae nunc ac, ornare blandit est. Ut bibendum laoreet
                dapibus. Nunc quis rhoncus nisl. Mauris lobortis iaculis nunc
                euismod accumsan.Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Proin nisl nisl, auctor.
              </p>
            </div>
            <img src="/assets/images/example.png" alt=""></img>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
