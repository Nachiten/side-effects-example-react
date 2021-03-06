import React, {
   useState,
   useReducer,
   useContext,
   useEffect,
   useRef,
} from "react";

import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";
import Input from "../UI/Input/Input";

import classes from "./Login.module.css";

const emailReducer = (state, action) => {
   switch (action.type) {
      case "USER_INPUT":
         return { value: action.val, isValid: action.val.includes("@") };
      case "INPUT_BLUR":
         return { value: state.value, isValid: state.value.includes("@") };
      default:
         return { value: "", isValid: false };
   }
};

const passwordReducer = (state, action) => {
   switch (action.type) {
      case "USER_INPUT":
         return { value: action.val, isValid: action.val.length > 6 };
      case "INPUT_BLUR":
         return { value: state.value, isValid: state.value.length > 6 };
      default:
         return { value: "", isValid: false };
   }
};

const Login = (props) => {
   const [formIsValid, setFormIsValid] = useState(false);

   const [emailState, dispatchEmail] = useReducer(emailReducer, {
      value: "",
      isValid: null,
   });

   const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
      value: "",
      isValid: null,
   });

   const authCtx = useContext(AuthContext);

   const { isValid: emailIsValid } = emailState;
   const { isValid: passwordIsValid } = passwordState;

   useEffect(() => {
      const id = setTimeout(() => {
         console.log("CHECKING FORM VALIDITY");
         setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);

      return () => {
         console.log("CLEANUP");
         clearTimeout(id);
      };
   }, [emailIsValid, passwordIsValid]);

   // --- EMAIL ---

   const emailChangeHandler = (event) => {
      dispatchEmail({ type: "USER_INPUT", val: event.target.value });
   };

   const validateEmailHandler = () => {
      dispatchEmail({ type: "INPUT_BLUR" });
   };

   // --- PASSWORD ---

   const passwordChangeHandler = (event) => {
      dispatchPassword({ type: "USER_INPUT", val: event.target.value });
   };

   const validatePasswordHandler = () => {
      dispatchPassword({ type: "INPUT_BLUR" });
   };

   // ------

   const emailInputRef = useRef();
   const passwordInputRef = useRef();

   const submitHandler = (event) => {
      event.preventDefault();

      if (formIsValid) authCtx.onLogin(emailState.value, passwordState.value);
      else if (!emailIsValid) emailInputRef.current.focus();
      else passwordInputRef.current.focus();
   };

   return (
      <Card className={classes.login}>
         <form onSubmit={submitHandler}>
            <Input
               ref={emailInputRef}
               label="E-Mail"
               type="email"
               id="email"
               value={emailState.value}
               onChange={emailChangeHandler}
               onBlur={validateEmailHandler}
               isValid={emailIsValid}
            />

            <Input
               ref={passwordInputRef}
               label="Password"
               type="password"
               id="password"
               value={passwordState.value}
               onChange={passwordChangeHandler}
               onBlur={validatePasswordHandler}
               isValid={passwordIsValid}
            />

            <div className={classes.actions}>
               <Button type="submit" className={classes.btn}>
                  Login
               </Button>
            </div>
         </form>
      </Card>
   );
};

export default Login;
