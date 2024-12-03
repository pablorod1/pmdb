import type { Provider } from "@lib/api/media";
import { PROVIDERS } from "@lib/api/movies";
import { initFlowbite } from "flowbite";
import React from "react";

interface Props {
  buttonId: string;
  dropdownId: string;
  provider: Provider;
  handleProviderChange: (provider: Provider) => void;
}

const ProvidersDropdown: React.FC<Props> = (props) => {
  const { buttonId, dropdownId, provider, handleProviderChange } = props;

  React.useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <>
      <button
        id={buttonId}
        data-dropdown-trigger="hover"
        data-dropdown-toggle={dropdownId}
        className="text-white bg-[var(--background-color)]  focus:outline-none  font-medium rounded-lg  text-center inline-flex items-center  capitalize"
        type="button"
      >
        <img
          className="size-10 rounded-lg"
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
        />

        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id={dropdownId}
        className="z-20 hidden max-w-56 w-full bg-[var(--background-color)] shadow-[0px_0px_4px_rgba(203,196,0,14)] divide-y divide-gray-100 rounded-lg"
      >
        <ul className="py-2 text-sm text-white" aria-labelledby={buttonId}>
          {PROVIDERS.map((provider: Provider, index: number) => (
            <li key={index}>
              <button
                onClick={() => handleProviderChange(provider)}
                type="button"
                className="flex items-center gap-2 w-full text-left px-6 py-2 hover:bg-[--primary-color] hover:text-[var(--background-color)] transition-colors duration-200 ease-in-out"
              >
                <img
                  className="size-6 rounded-md"
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                />
                <span>{provider.provider_name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProvidersDropdown;
