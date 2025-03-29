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
        <div>
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
  );
}
