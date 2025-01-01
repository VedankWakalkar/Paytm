"use client"

export function TextInput({
    placeholder,
    onChange,
    label
}:{
    placeholder:string;
    onChange:(value:string)=>void;
    label:string;
}):JSX.Element{
    return <div>
        <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
        <input onChange={(e)=>{
            onChange(e.target.value)
        }} placeholder={placeholder}></input>
    </div>
}