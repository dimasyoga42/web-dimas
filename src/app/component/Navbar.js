"use client";

import { useState } from "react";
import Link from "next/link";

const Navbar = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="w-full border-2 border-black bg-white">
      <div className="flex h-20 items-center justify-between px-3 md:px-5">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="text-2xl font-bold font-spacegrotesk text-black"
        >
          Dimas Yoga
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/"
            className="
              border-2 border-black
              bg-white
              px-4 py-2
              font-bold text-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              transition-all
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:bg-green-400
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            "
          >
            Home
          </Link>
          <Link
            href="/anime"
            className="
              border-2 border-black
              bg-white
              px-4 py-2
              font-bold text-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              transition-all
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:bg-green-400
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            "
          >
            Anime
          </Link>
          <Link
            href="/blog"
            className="
              border-2 border-black
              bg-green-400
              px-4 py-2
              font-bold text-black
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              transition-all
              hover:translate-x-[2px]
              hover:translate-y-[2px]
              hover:bg-black
              hover:text-white
              hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            "
          >
            Blog
          </Link>

          {session ? (
            <>
              <Link
                href="/dashboard"
                className="
                  border-2 border-black
                  bg-green-400
                  px-4 py-2
                  font-bold text-black
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  transition-all
                  hover:translate-x-[2px]
                  hover:translate-y-[2px]
                  hover:bg-black
                  hover:text-white
                  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                "
              >
                dashboard
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="
                border-2 border-black
                bg-sky-500
                px-4 py-2
                font-bold text-white
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transition-all
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                hover:bg-black
                hover:text-white
                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              "
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
          className="
            border-2 border-black
            bg-white
            p-2
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all
            hover:translate-x-[2px]
            hover:translate-y-[2px]
            hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            md:hidden
          "
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="border-t-2 border-black px-3 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={closeMenu}
              className="
                border-2 border-black
                bg-white
                px-4 py-3
                text-center
                font-bold text-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transition-all
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                hover:bg-green-400
                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              "
            >
              Home
            </Link>
            <Link
              href="/anime"
              onClick={closeMenu}
              className="
                border-2 border-black
                bg-white
                px-4 py-3
                text-center
                font-bold text-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transition-all
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                hover:bg-green-400
                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              "
            >
              Anime
            </Link>
            <Link
              href="/blog"
              className="
                border-2 border-black
                bg-white
                px-4 py-2
                font-bold text-black
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transition-all
                hover:translate-x-[2px]
                hover:translate-y-[2px]
                text-center
                hover:bg-green-500
                hover:text-white
                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              "
            >
              Blog
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="
                    border-2 border-black
                    bg-green-400
                    px-4 py-3
                    text-center
                    font-bold text-black
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    transition-all
                    hover:translate-x-[2px]
                    hover:translate-y-[2px]
                    hover:bg-black
                    hover:text-white
                    hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  "
                >
                  dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="
                  border-2 border-black
                  bg-sky-500
                  px-4 py-3
                  text-center
                  font-bold text-white
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  transition-all
                  hover:translate-x-[2px]
                  hover:translate-y-[2px]
                  hover:bg-black
                  hover:text-white
                  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                "
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
