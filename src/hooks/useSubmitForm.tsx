import { useState } from 'react';
import { dictionary } from '../contants/Signin.Constant';
import { signin } from '../apiService/signin';

interface LoginObj {
  email: string;
  password: string;
}

interface UseSubmitFormProps {
  loginObj: LoginObj;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

const useSubmitForm = ({loginObj, onSuccess, onError}: UseSubmitFormProps) => {  

  const [loading, setLoading] = useState(false);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginObj.email.trim() === "") {
      return onError(dictionary.login.mail_is_required);
    }

    if (loginObj.password.trim() === "") {
      return onError(dictionary.login.forgot_your_password);
    } else {
      setLoading(true);

      const data = await signin.post(loginObj)

      if (!data || data?.error || data?.message) {
        onError(data.error || data.message || "An error occurred.");
        setLoading(false)
      } else if (data?.result.AccessToken) {
        onSuccess(data.result.AccessToken);
      }

    }
  };

  return { submitForm, loading,  };
};

export default useSubmitForm;