import React from "react";

function AboutUs() {
  const containerStyle = {
    width: "100%",
    maxWidth: "1200px", 
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "auto auto", 
    gap: "20px", 
    marginBottom: "40px", 
  };

  const textStyle = {
    padding: "20px",
    textAlign: "center",
    justifyContent: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const imageStyle = {
    maxWidth: "100%",
    height: "auto",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  const supportStyle = {
    padding: "20px",
    textAlign: "center",
    justifyContent: "center",
    border: "1px solid #ccc",
    borderRadius: "5px",
  };

  return (
    <div style={containerStyle}>
      <h1>About Us</h1>

      <div style={gridStyle}>
        <div style={textStyle}>
          <h2>Our Story</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Donec volutpat consequat libero, sed bibendum purus semper ac.
          </p>
        </div>

        <div>
          <img src="https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_960_720.jpg" alt="First Image" style={imageStyle}/>
        </div>

        <div>
          <img src="https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg" alt="Second Image" style={imageStyle}/>
        </div>

        <div style={supportStyle}>
          <h3>Links & Support Us</h3>
          <p>If you enjoy our content and would like to support our work:</p>
          <ul>
            <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a href="https://patreon.com" target="_blank" rel="noreferrer">Patreon</a></li>
            <li><a href="https://paypal.me" target="_blank" rel="noreferrer">PayPal</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
