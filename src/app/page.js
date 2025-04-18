import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <>
      <video
        src="./assets/videos/Read-Y Home.m4v"
        autoPlay
        muted
        id="video-home"
      ></video>
      <div className="container-home">
        <div>
          <a href="#">
            <FontAwesomeIcon icon={faCirclePlay} className="white-icons" />
            Check our Web Reader's tutorials now!
          </a>
        </div>
      </div>
    </>
  );
}
