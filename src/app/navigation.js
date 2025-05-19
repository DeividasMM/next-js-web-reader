import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faBookOpen,
  faHome,
  faCircleUser,
  faCircleInfo,
  faCircleDollarToSlot,
} from "@fortawesome/free-solid-svg-icons";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navigation() {
  return (
    <>
      <style>
        {`
          @keyframes anime {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <div className="navigation-container">
        <SignedOut>
          <SignInButton mode="modal">
            <div className="button-container">
              <a href="#" className="link">
                <FontAwesomeIcon icon={faCircleUser} className="icon" />
                <span className="tooltip-text">Sign In</span>
              </a>
            </div>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div
            style={{
              display: "flex",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              filter: "drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.1))",
              background:
                "linear-gradient(90deg, #F2F0EF 25%, #FE9B27 50%, #F2F0EF 75%)",
              backgroundSize: "200% 100%",
              animation: "anime 1.5s infinite linear",
            }}
          >
            <UserButton />
          </div>
        </SignedIn>

        <div className="button-container">
          <a href="/" className="link">
            <FontAwesomeIcon icon={faHome} className="icon" />
            <span className="tooltip-text">Home</span>
          </a>
        </div>

        <div className="button-container">
          <a href="/upload" className="link">
            <FontAwesomeIcon icon={faDownload} className="icon" />
            <span className="tooltip-text">Upload</span>
          </a>
        </div>

        <div className="button-container">
          <a href="/library" className="link">
            <FontAwesomeIcon icon={faBookOpen} className="icon" />
            <span className="tooltip-text">Library</span>
          </a>
        </div>

        <div className="button-container">
          <a href="/about" className="link">
            <FontAwesomeIcon icon={faCircleInfo} className="icon" />
            <span className="tooltip-text">About Us</span>
          </a>
        </div>

        <div className="button-container">
          <a href="/about" className="link">
            <FontAwesomeIcon icon={faCircleDollarToSlot} className="icon" />
            <span className="tooltip-text">Support Us</span>
          </a>
        </div>
      </div>
    </>
  );
}
