// export function Card({
//   className,
//   title,
//   children,
//   href,
// }: {
//   className?: string;
//   title: string;
//   children: React.ReactNode;
//   href: string;
// }): JSX.Element {
//   return (
//     <div className={className}>
//       <a
//         href={`${href}?utm_source=create-turbo&utm_medium=basic&utm_campaign=create-turbo`}
//         rel="noopener noreferrer"
//         target="_blank"
//       >
//         <h2 className="text-sm">
//           {title} <span>-&gt;</span>
//         </h2>
//       </a>
//       <div>{children}</div>
//     </div>
//   );
// }


export function Card({
  title,
  children
}:{
  title:string,
  children :React.ReactNode;
}):JSX.Element{
  return <div className="border p-4 bg-white rounded-xl bg-[#ededed] w-full">   
    <h1 className="text-xl border-b pb-2">
      {title}
    </h1>
    <div>
      {children}
    </div>
  </div>
}