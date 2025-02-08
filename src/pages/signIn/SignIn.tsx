import ErrorText from "../../components/typography/errorText/page";
import { dictionary } from "../../contants/Signin.Constant";
import useLoginForm from "../../hooks/useLoginForm";
import bgImage from "../../assets/fondo_blanco_login.png";
import valeiaImg from "../../assets/valeia_avatar.png";
import valeiaLogo from "../../assets/valeia_logo.png";

import InputLog, { InputLogProps } from "./InputLog";

const SignIn = () => {
  const { loginObj, updateFormValue, errorMessage, submitForm, loading } =
    useLoginForm();

  const renderProps = (inputProps: InputLogProps) => (
    <InputLog {...inputProps} />
  );

  return (
    <div
      className="flex w-full h-full"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
      }}
    >
      <div>
        <div className="bg-white rounded-3xl box-border ml-[104px] mt-[200px] mb-[186px] w-[40vw] h-[65vh]">
          <img src={valeiaLogo} className="m-auto my-20" />

          <form
            onSubmit={(e) => submitForm(e)}
            className="text-center px-[8em]"
          >
            {renderProps({
              type: "email",
              defaultValue: loginObj.email || "",
              updateType: "email",
              containerStyle: "mt-4",
              labelTitle: dictionary.login.email || "",
              updateFormValue: updateFormValue,
            })}

            {renderProps({
              type: "password",
              defaultValue: loginObj.password || "",
              updateType: "password",
              containerStyle: "mt-4",
              labelTitle: dictionary.login.password || "",
              updateFormValue: updateFormValue,
            })}
            <div className="mb-16 mt-16 mx-auto">
              <div className="text-right text-primary my-4">
                <a href="/forgot-password">
                  <p className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200 text-gray-500">
                    {dictionary.login.forgot_your_password}
                  </p>
                </a>
              </div>

              {errorMessage && (
                <ErrorText styleClass="mb-4">{errorMessage}</ErrorText>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-[97px] btn btn-primary bg-blue-500 text-white font-bold py-2 px-4 rounded-full ${
                loading ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {!loading ? (
                dictionary.login.get_into
              ) : (
                <div className="flex justify-center items-center mx-auto">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white" />
                </div>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="w-screen h-screen">
        <img src={valeiaImg} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default SignIn;
