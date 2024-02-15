import React from "react";
import "../css/Home.css";

function Home() {
  return (
    <div>
      <div className="b-example-divider"></div>

      <div className="container col-xl-10 col-xxl-8 px-4 py-5">
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-7 text-center text-lg-start">
            <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3 h1-wrapper">
              Uncover Hidden Gems: StealthScraper, Your Stealthy Guide to Web
              Discovery!
            </h1>
            <p className="col-lg-10 fs-4">
              StealthScraper is a sleek and intuitive web application designed
              for efficient data extraction from various websites. With advanced
              scraping algorithms operating silently in the background, users
              can effortlessly collect valuable insights without leaving a
              trace. Whether you're a business analyst, researcher, or
              entrepreneur, StealthScraper provides the tools to unlock hidden
              data treasures and gain a competitive edge in your industry.
            </p>
          </div>
          <div className="col-md-10 mx-auto col-lg-5">
            <img src="/ninja.png" style={{ height: "600px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
