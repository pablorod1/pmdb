import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import {
  allProviders,
  discoverSeriesByProvider,
  PROVIDERS,
  type Serie,
} from "@lib/api/series";
import type { Provider } from "@lib/api/media";
import Loader from "@components/UI/Loader";
import { initFlowbite } from "flowbite";
import SliderMediaCard from "@components/UI/SliderMediaCard";
import ProvidersDropdown from "@components/UI/ProvidersDropdown";

const ProviderSeriesGlide: React.FC = () => {
  const [series, setSeries] = React.useState<Serie[]>([]);
  const [provider, setProvider] = React.useState<Provider>(
    PROVIDERS[0] as Provider
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const glideRef = React.useRef<Glide | null>(null);

  const handleProviderChange = async (newProvider: Provider) => {
    setProvider(newProvider);
    setLoading(true);
    try {
      const newSeries = await discoverSeriesByProvider(
        1,
        newProvider.provider_id.toString()
      );
      setSeries(newSeries.series);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching series:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchSeries = async () => {
      try {
        const newSeries = await discoverSeriesByProvider(
          1,
          provider.provider_id.toString()
        );
        setSeries(newSeries.series);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching series:", error);
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  React.useEffect(() => {
    const initializeGlide = () => {
      if (!loading && series.length > 0) {
        if (glideRef.current) {
          glideRef.current.destroy();
        }

        const glideInstance = new Glide.default(".provider-series-glide", {
          type: "carousel",
          startAt: 0,
          focusAt: 0,
          perView: 10,
          gap: 30,
          breakpoints: {
            2000: {
              perView: 7,
            },
            1600: {
              perView: 6,
            },
            1200: {
              perView: 5,
            },
            1024: {
              perView: 4,
            },
            768: {
              perView: 3,
            },
            600: {
              perView: 2,
            },
          },
        });

        requestAnimationFrame(() => {
          glideInstance.mount();
          glideRef.current = glideInstance;
        });
      }
    };

    initializeGlide();
    initFlowbite();

    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
        glideRef.current = null;
      }
    };
  }, [loading, series]);

  if (loading)
    return (
      <div className="w-full h-auto flex flex-col justify-center items-center gap-4 my-12">
        <Loader />
      </div>
    );
  if (series.length === 0) {
    return (
      <div className="bg-gray-200 mb-8 py-2 px-4 w-full">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col ps-6 ">
      <div className="flex items-center gap-4">
        <h1 className="flex items-center text-white font-bold text-3xl">
          Top 20 series de {provider.provider_name}
        </h1>
        <ProvidersDropdown
          buttonId="providerSeriesDropdownButton"
          dropdownId="providerSeriesDropdown"
          provider={provider}
          handleProviderChange={handleProviderChange}
        />
      </div>
      <div className="provider-series-glide relative py-12">
        <div className="glide__track mx-12" data-glide-el="track">
          <ul className="glide__slides">
            {series.map((serie: Serie, index: number) => (
              <li key={index} className="glide__slide h-full">
                <SliderMediaCard item={serie} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProviderSeriesGlide;
