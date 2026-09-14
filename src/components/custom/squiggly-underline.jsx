import Link from "next/link";

export const SquigglyUnderline = ({ children, className, href }) => {
  return (
    <span className="relative inline-block group">
      <Link className={`relative z-10 ${className}`} href={href}>
        {children}
      </Link>
      <svg
        className="absolute bottom-0 left-0 w-full h-2 overflow-visible"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
      >
        <path
          d="M0,4 Q25,1 50,4 T100,4"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-clay-400"
        />
      </svg>
    </span>
  );
};
