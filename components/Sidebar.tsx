import { Backdrop, Transition, WindmillContext } from "@windmill/react-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Map, Home } from "react-feather";
import shallow from "zustand/shallow";

import CoronaSafeLogo from "../assets/coronaSafeLogo.svg";
import { useGlobalStore } from "../lib/stores";

const routes = [
  { href: "/", label: "Home", icon: Home },
  { href: "/hotspots", label: "Hotspots", icon: Map },
];

export default function Sidebar() {
  const router = useRouter();
  const { mode, toggleMode } = useContext(WindmillContext);
  const [isSidebarOpen, toggleSidebar] = useGlobalStore(
    (state) => [state.isSidebarOpen, state.toggleSidebar],
    shallow
  );

  return (
    <>
      <aside className="flex flex-col flex-shrink-0 h-full pointer-events-none fixed w-full z-50 xl:w-auto">
        <Transition
          show={isSidebarOpen}
          enter="transition ease-in-out duration-150"
          enterFrom="opacity-0 transform -translate-x-20"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 transform -translate-x-20"
        >
          <nav className="dark:bg-gray-800 bg-white rounded-lg flex flex-col h-full justify-between my-6 mx-6 py-4 pointer-events-auto dark:text-gray-200 z-40 xl:w-auto">
            <ul className="mt-2 space-y-3">
              {routes.map((r, i) => (
                <li key={i} className="px-2 py-2 relative">
                  {router.pathname === r.href && (
                    <span
                      className="bg-green-500 rounded-br-lg rounded-tr-lg inset-y-0 left-0 absolute w-1"
                      aria-hidden="true"
                    />
                  )}
                  <Link href={r.href} passHref>
                    <a className="dark:hover:text-gray-200 items-center appearance-none inline-flex text-sm font-semibold outline-none dark:text-gray-400 text-gray-500 hover:text-gray-800 duration-150 transition-colors w-full">
                      <r.icon className="h-5 ml-4 w-5" />
                      <span className="ml-2">{r.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="px-6 space-y-1">
              <ul className="flex text-sm space-x-2">
                <li>
                  <button
                    type="button"
                    onClick={toggleMode}
                    aria-label="Toggle color mode"
                  >
                    {mode === "dark" ? "Use Light theme" : "Use Dark theme"}
                  </button>
                </li>
              </ul>
              <ul className="flex text-sm space-x-2">
                <li>
                  <a href="https://github.com/coronasafe/kerala-dashboard">
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://github.com/coronasafe/kerala-dashboard/issues">
                    Issues
                  </a>
                </li>
                <li>
                  <a href="https://coronasafe.network/volunteer">Volunteer</a>
                </li>
                <li>
                  <a href="mailto:info@coronasafe.network">Contact</a>
                </li>
              </ul>
              <li className="flex flex-col">
                <a
                  href="https://coronasafe.network/"
                  className="inline-flex text-xs space-x-1"
                >
                  <span>Copyright © 2020</span>
                  <CoronaSafeLogo className="h-4" aria-hidden="true" />
                </a>
                <a
                  href="https://github.com/coronasafe/kerala-dashboard/blob/master/LICENSE"
                  className="text-xxs"
                >
                  Released under the MIT License
                </a>
              </li>
            </ul>
          </nav>
        </Transition>
      </aside>
      <Transition
        show={isSidebarOpen}
        enter="transition ease-in-out duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in-out duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Backdrop onClick={toggleSidebar} />
      </Transition>
    </>
  );
}
