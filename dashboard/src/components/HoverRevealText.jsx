const HoverRevealText = ({ text, className = "" }) => {
   if (!text) return null;
   return (
      <div
         className={`group/reveal relative inline-block max-w-full ${className}`}
      >
         <span className="block truncate">{text}</span>
         <div
            className="pointer-events-none absolute z-20 left-0 top-full mt-1 hidden group-hover/reveal:block
                     max-w-xs  text-xs text-on-surface whitespace-normal break-words bg-surface-container-high
                     border border-outline-variant rounded-lg px-3 py-2 shadow-lg"
         >
            {text}
         </div>
      </div>
   );
};

export default HoverRevealText;
