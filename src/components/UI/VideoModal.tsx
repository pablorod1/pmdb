import React from "react";

interface Props {
  videoId: string;
}

const VideoModalComponent: React.FC<Props> = (props) => {
  const { videoId } = props;
  const [url, setUrl] = React.useState<string>("");
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setUrl(`https://www.youtube.com/embed/${videoId}`);
  }, [videoId]);

  React.useEffect(() => {
    if (isOpen) {
      document.getElementById("video-modal")?.classList.remove("hidden");
      document.getElementById("video-modal")?.classList.add("flex");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const openVideo = () => {
    setIsOpen(true);
  };

  const closeVideo = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        type="button"
        onClick={openVideo}
      >
        Abrir Video
      </button>

      {
        <div
          id="video-modal"
          className="hidden fixed inset-0 z-50  items-center justify-center bg-black bg-opacity-50 h-screen"
        >
          <div className="relative w-11/12 max-w-2xl  z-50 shadow-lg">
            <button
              onClick={closeVideo}
              type="button"
              className="absolute -top-12 right-4 bg-[var(--primary-color)] rounded-full p-1 hover:bg-gray-400 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--background-color)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-x"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            <iframe
              id="video"
              className="w-full aspect-video roundedLg"
              src={url}
              allowFullScreen
            />
          </div>
        </div>
      }
    </div>
  );
};

export default VideoModalComponent;
