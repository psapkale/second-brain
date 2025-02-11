const SelectSpacePlaceholder = () => {
   // "https://pbs.twimg.com/media/GhapST9aEAAr2Jv?format=jpg&name=large",

   return (
      <div className="w-full flex items-center justify-center gap-3 flex-col">
         <img
            // src="https://i.pinimg.com/736x/ed/7e/64/ed7e641be30d02a53cfc44272b84f5f4.jpg"
            src="/sleeping-duck.png"
            alt="space-placeholder"
            className="w-[20vw] h-[42vh]"
         />
         <span className="text-slate-600 text-xs">
            There is no space to work!!
         </span>
         <span className="text-slate-600 text-xs">
            select from there 'left arrow svg'
         </span>
      </div>
   );
};

export default SelectSpacePlaceholder;
