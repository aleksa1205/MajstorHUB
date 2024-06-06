import { useForm } from "react-hook-form";
import useModalAnimation from "../../../hooks/useModalAnimation";
import useLogout from "../../../hooks/useLogout";
import useAuth from "../../../hooks/useAuth";
import useUserControllerAuth, {
  SessionEndedError,
} from "../../../api/controllers/useUserControllerAuth";
import { useErrorBoundary } from "react-error-boundary";
import classes from "./Novac.module.css";
import formCl from "../../FormStyles/Form.module.css";
import ModalAnimated from "../../Theme/Modal/ModalAnimated";
import { CiMoneyBill } from "react-icons/ci";
import { MdErrorOutline } from "react-icons/md";

type FormValues = {
  value: number;
};

type PropsValues = {
  currAmount: number;
  refetch: () => void;
  setSuccMessage: React.Dispatch<React.SetStateAction<string>>
};

export default function IsplatiNovac({ currAmount, refetch, setSuccMessage }: PropsValues) {
    const form = useForm<FormValues>({ mode: "onChange" });
    const { register, formState, handleSubmit, watch, setValue, clearErrors } =
      form;
    const { errors, isValid } = formState;
  
    const amount = watch("value");
  
    const logoutUser = useLogout();
    const { auth } = useAuth();
    const { withdraw } = useUserControllerAuth(auth.userType);
    const { showBoundary } = useErrorBoundary();
  
    const { closeModal, openModal, transition } = useModalAnimation();
  
    async function onSend() {
      try {
        await withdraw(amount);
        setSuccMessage(`Uspešno isplaćeno ${amount} dinara`);
        window.scrollTo(0, 0);
        closeModal();
        refetch();
      } catch (error) {
        if (error instanceof SessionEndedError) logoutUser();
        else showBoundary(error);
      }
    }
  
    async function onSubmit() {
      openModal();
    }
  
    return (
      <section className={classes.section2}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={formCl.form}
          noValidate
        >
  
          {transition((style, show) => {
            return show ? (
              <ModalAnimated style={style} onClose={closeModal}>
                <div className={classes.confirm}>
                  <h3>Potvrda</h3>
                  <p>Da li ste sigurni da želite da podignete 
                    <span className={classes.bold}> {Math.round(amount)} dinara</span>
                  </p>
                  <p>Tada će vaše novo stanje biti
                    <span className={classes.bold}> {Math.round(currAmount - amount)} dinara</span>
                  </p>
                  <div className={formCl.btnContainer}>
                    <button type="button" onClick={onSend} className="mainButtonSmall">Potvrdi</button>
                    <button type="button" onClick={closeModal} className="secondLink">Ponisti</button>
                  </div>
                </div>
              </ModalAnimated>
            ) : null;
          })}
  
          <h3>Podizanje novca sa platforme</h3>
          <p>
            <span className={classes.bold}>Unesite Iznos</span>
          </p>
          <div
            className={
              formCl.inputGroup + " " + `${errors.value ? `${formCl.error}` : ""}`
            }
          >
            <CiMoneyBill size="2rem" className={formCl.inputIcon} />
            <input
              type="text"
              id="isplata"
              placeholder="5000"
              {...register("value", {
                required: "Ovo polje je obavezno",
                valueAsNumber: true,
                validate: (fieldValue) => {
                  let msg: string = "";
                  let valid = false;
  
                  if (fieldValue < 1000 || fieldValue > 200000)
                    msg = "Iznos mora da bude između 1000 i 200 000 dinara";
                  else if (Number.isNaN(fieldValue))
                    msg = "Dozvoljeni su samo brojevi";
                  else if (currAmount - fieldValue < 0)
                    msg =
                      "Ne mozete da skinete vise novca nego sto imate na profilu";
                  else valid = true;
  
                  return valid || msg;
                },
              })}
            />
          </div>
          <p className={formCl.pError}>
            {errors.value?.message && <MdErrorOutline />}
            {errors.value?.message}
          </p>
  
          {/* <p>
              <span className={classes.bold}>Biće vam naplaćeno</span>
            </p>
            <p className={classes.gray}>
                {isValid 
                ? `${amount} dinara + Taksa`
                : '0 dinara'}
            </p> */}
  
          <p>
            <span className={classes.bold}>Vaše novo stanje na profilu biće</span>
          </p>
          <p className={classes.gray}>
            {isValid
              ? `${Math.round(currAmount - amount)} dinara`
              : `${Math.round(currAmount)} dinara`}
          </p>
  
          <div className={formCl.btnContainer}>
            <button
              onClick={() => {
                setValue("value", 0);
                clearErrors();
              }}
              type="reset"
              className="secondLink"
            >
              Poništi
            </button>
            <button className="mainButtonSmall">Isplati</button>
          </div>
        </form>
      </section>
    );
  }
  