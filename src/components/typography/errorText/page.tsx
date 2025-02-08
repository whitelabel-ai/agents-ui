import React from "react";
import { ErrorTextProps } from "../../interfaces/interface";

const ErrorText: React.FC<ErrorTextProps> = ({ styleClass = "", children }) => (
  <p className={`text-center text-error text-red-500 ${styleClass}`}>{children}</p>
);

export default ErrorText;
