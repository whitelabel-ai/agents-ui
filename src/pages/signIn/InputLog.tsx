import React, { useState } from "react";

export interface InputLogProps {
  labelTitle?: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue?: (value: { updateType: string; value: string }) => void;
  updateType?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; 
}

export interface InputComponentProps {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface LabelComponentProps {
  children: React.ReactNode;
  className?: string;
}

interface UpdateInputValueEvent extends React.ChangeEvent<HTMLInputElement> {
  clipboardData?: DataTransfer;
}


const InputComponent: React.FC<InputComponentProps> = ({type, value, placeholder, onChange, className, ...rest}) => (
  <input type={type} value={value} placeholder={placeholder} onChange={onChange} className={className} {...rest}/>
)

const LabelComponent: React.FC<LabelComponentProps> = ({ children }) => (
  <label className="label text-gray-500 text-left">
    {children}
  </label>  
)

const InputLog: React.FC<InputLogProps> = ({
  labelTitle,
  labelStyle = "",
  type = "text",
  containerStyle = "",
  defaultValue = "",
  placeholder = "",
  updateFormValue,
  updateType,
  ...inputProps
}) => {
  const [value, setValue] = useState(defaultValue);

  const updateInputValue = (e: UpdateInputValueEvent) => {
    const { target } = e || {};

    setValue(target?.value || e.clipboardData?.getData('text') || '');

    if (updateFormValue && updateType) {
      updateFormValue({ updateType, value: e.target.value });
    }
    
  };

  const inputClassName = `border w-full w-full bg-neutral text-black py-1 px-2 ${inputProps.className || ''}`.trim();

  return (

    <div className={`form-control w-full ${containerStyle}`}>
      <LabelComponent className="label text-gray-500 text-left">
        <p className={`label-text text-base-content ${labelStyle}`}>
          {labelTitle}
        </p>
      </LabelComponent>
    
      <InputComponent
        type={type || "text"}
        value={value}
        placeholder={placeholder || ''}
        onChange={updateInputValue}
        className={inputClassName}
        {...inputProps}
      />
    </div>
  );
};

export default InputLog;
