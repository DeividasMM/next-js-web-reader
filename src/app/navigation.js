import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faBookOpen, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Navigation() {
  return (
    <ClerkProvider>
      <div className="navigation-container">
        <div className="top-divider"></div>

        <SignedOut>
          <SignInButton>
            <div className="button-container">
              <a href="#" className="link">
                <FontAwesomeIcon icon={faCircleUser} className="icon" />
                <span className="tooltip-text">Sign In</span>
              </a>
            </div>
          </SignInButton>
        </SignedOut>

        <div className="divider"></div>

        <div className="button-container">
          <a href="#" className="link">
            <FontAwesomeIcon icon={faDownload} className="icon" />
            <span className="tooltip-text">Upload</span>
          </a>
        </div>

        <div className="divider"></div>

        <div className="button-container">
          <a href="#" className="link">
            <FontAwesomeIcon icon={faBookOpen} className="icon" />
            <span className="tooltip-text">Library</span>
          </a>
        </div>

        <div className="bottom-divider"></div>

        <SignedIn>
          <div>
            <UserButton />
          </div>
        </SignedIn>
      </div>

      <style>{`
        .tooltip-text {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          left: 70px;
          top: 28px;
          transform: translateX(-10px) translateY(-12px);
          background-color: black;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          transition: transform 0.3s ease-in-out, opacity 0.4s;
        }

        .link:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
          transform: translateX(0) translateY(-12px);
        }

        .link {
          display: flex;
          align-items: center;
          padding: 10px;
          height: 50px;
          width: 50px;
          color: black;
          border-left: 1px solid black;
          border-right: 1px solid black;
          position: relative;
          text-decoration: none;
          background-color: white;
        }

        .icon {
          width: 50px;
          height: 50px;
        }

        .top-divider {
          width: 50px;
          height: 25px;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid black;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background-color: white;
        }

        .top-divider::before {
          content: '';
          width: 100%;
          height: 1px;
          background-color: black;
        }

        .divider {
          width: 50px;
          height: 50px;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid black;
          background-color: white;
        }

        .divider::before {
          content: '';
          width: 100%;
          height: 1px;
          background-color: black;
        }

        .bottom-divider {
          width: 50px;
          height: 25px;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid black;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          background-color: white;
        }

        .bottom-divider::before {
          content: '';
          width: 100%;
          height: 1px;
          background-color: black;
        }

        .navigation-container {
          position: fixed;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }

        .button-container + .button-container {
          margin-top: 10px;
        }
      `}</style>
    </ClerkProvider>
  );
}
