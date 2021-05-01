import clsx from "clsx";
import { Menu } from "react-feather";
import shallow from "zustand/shallow";

import { useGlobalStore } from "../lib/stores";

type HeaderProps = {
  text: string;
  lastUpdated: string;
  float?: boolean;
};

export default function Header({
  text,
  lastUpdated,
  float = false,
}: HeaderProps) {
  const [isSidebarOpen, toggleSidebar] = useGlobalStore(
    (state) => [state.isSidebarOpen, state.toggleSidebar],
    shallow
  );

  return (
    <div
      className={clsx(
        "flex flex-shrink-0 h-12 py-2 dark:text-green-400 text-green-500",
        float && "fixed left-0 top-0 z-10 ml-6"
      )}
    >
      <button
        type="button"
        className={clsx(
          "rounded-md mr-2 focus:outline-none p-1 pointer-events-auto md:mr-6",
          isSidebarOpen && "shadow-outline-green"
        )}
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="block mr-1 pointer-events-none dark:text-green-400 text-green-500">
        <span className="block text-2xl font-black leading-none">{text}</span>
        <span className="block text-xxs leading-none">
          Last updated on {lastUpdated}
        </span>
      </div>
    </div>
  );
}
