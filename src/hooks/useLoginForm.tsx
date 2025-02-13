import { useContext, useState } from "react";

import useSubmitForm from "./useSubmitForm";
import { INITIAL_LOGIN_OBJ } from "../contants/Signin.Constant";
import AuthContext from "../context/AuthContext.Context";
import { useNavigate } from "react-router-dom";

export interface LoginObj {
  email: string;
  password: string;
}

interface UpdateFormValueProps {
  updateType: string;
  value: string;
}

interface UseLoginFormReturnType {
  submitForm: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  loginObj: LoginObj;
  updateFormValue: ({ updateType, value }: UpdateFormValueProps) => void;
  errorMessage: string;
  loading: boolean;
}

const useLoginForm = (): UseLoginFormReturnType => {
  const navigate = useNavigate();

  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
  const [errorMessage, setErrorMessage] = useState("");

  const { setToken } = useContext(AuthContext);

  const onSuccess = (token: string) => {
    setToken(token);
    navigate('/dashboard');
  };

  const onError = (error: string) => {
    setErrorMessage(error);
  }

  const { submitForm, loading } = useSubmitForm({loginObj, onSuccess, onError});

  const updateFormValue = ({ updateType, value }: UpdateFormValueProps) => {
    setErrorMessage("");
    setLoginObj((prevLoginObj) => ({ ...prevLoginObj, [updateType]: value }));
  };


  return {
    submitForm,
    loginObj,
    updateFormValue,
    errorMessage,
    loading
  }
}

export default useLoginForm;