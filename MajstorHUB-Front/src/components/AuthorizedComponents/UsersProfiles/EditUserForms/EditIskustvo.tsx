import { MdErrorOutline } from "react-icons/md";
import classes from "./EditUserForm.module.css";
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { IoClose } from "react-icons/io5";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";
import UserType from "../../../../lib/UserType";
import RadioCard from "../../../Theme/RadioCard/RadioCard";

type FromValues = {
  value: string;
};

type PropsValues = {
  close: () => void;
  updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>;
  userData: userDataUpdateType;
};

function EditIskustvo({ close, updateUser, userData }: PropsValues) {
  const form = useForm<FromValues>({
    defaultValues: {
      value:
        userData.userType !== UserType.Korisnik
          ? userData.iskustvo.toString()
          : Iskustvo.Nedefinisano.toString(),
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  if (isSubmitSuccessful) setTimeout(() => close(), 0);

  function onSubmit(formValues: FromValues) {
    const { value } = formValues;
    updateUser(prev => ({...prev!, iskustvo: parseInt(value)}));
  }

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.header}>
        <h3>Promenite iskustvo</h3>
        <IoClose onClick={close} size="2rem" />
      </div>

      <p>
        Izaberite nivo iskustva koje imate za vaše veštine koje ste izabrali
      </p>
      <p>
        Molimo vas da budete iskreni sa nivoom iskustva kako bi ste što
        preciznije mogli da nađete posao koji vama odgovara ali takođe nemojte
        potcenjivati sebe
      </p>

      <div className={classes.iskustvoContainer}>
        <RadioCard naslov="Početnik" opis="Ja sam relativno nov u ovoj oblasti">
          <input
            {...register("value", {
                required: 'Izaberite iskustvo'
            })}
            type="radio"
            value={Iskustvo.Pocetnik}
          />
        </RadioCard>
        <RadioCard
          naslov="Iskusan"
          opis="Imam značajno iskustvo u ovoj oblasti"
        >
            <input
            {...register("value", {
                required: 'Izaberite iskustvo'
            })}
            type="radio"
            value={Iskustvo.Iskusan}
          />
        </RadioCard>
        <RadioCard
          naslov="Profesionalac"
          opis="Posedujem duboko znanje iz ove oblasti"
        >
            <input
            {...register("value", {
                required: 'Izaberite iskustvo'
            })}
            type="radio"
            value={Iskustvo.Profesionalac}
          />
        </RadioCard>
      </div>

      {/* <input
                className={errors.value ? `${classes.error}` : ""}
                type="radio"
                id="iskustvo"
                placeholder="Niš, Aleksandra Medvedeva 14"
                {...register("value", {
                    required: 'Ovo je obavezno polje',
                    minLength: {
                        value: 5,
                        message: "Adresa mora da ima barem 5 karaktera"
                    },
                    maxLength: {
                        value: 30,
                        message: "Adresa ne moze da bude duza od 30 karaktera"
                    },
                })}
            /> */}
      <p className={classes.pError}>
        {errors.value?.message && <MdErrorOutline />}
        {errors.value?.message}
      </p>

      <div className={classes.btnContainer}>
        <button className="secondLink" onClick={close} type="button">
          Cancel
        </button>

        <button
          disabled={isSubmitting}
          className={
            "mainButtonSmall" + " " + `${isSubmitting ? "button--loading" : ""}`
          }
        >
          <span className="button__text">Save</span>
        </button>
      </div>
    </form>
  );
}

export default EditIskustvo;