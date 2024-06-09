import { MdErrorOutline } from "react-icons/md";
import classes from "./EditUserForm.module.css";
import { useForm } from "react-hook-form";
import { userDataUpdateType } from "../../../../api/DTO-s/updateSelfTypes";
import { MdFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { base64ToUrl, crop, formatBase64 } from "../../../../lib/utils";
import Hamster from "../../../Theme/Loaders/Hamster";
import InfoBox from "../../../Theme/Boxes/InfoBox";

type FromValues = {
  value: FileList;
};

type PropsValues = {
  close: () => void;
  updateUser: React.Dispatch<React.SetStateAction<userDataUpdateType | null>>;
  userData: userDataUpdateType;
};

function EditSlika({ close, updateUser, userData }: PropsValues) {
  const form = useForm<FromValues>();
  const { register, handleSubmit, formState, watch } = form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const [image, setImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputValue = watch("value");

  if (isSubmitSuccessful) setTimeout(() => close(), 0);

  useEffect(() => {
    function loadPicture() {
      if (userData.slika !== "") {
        setIsLoading(true);
        setImage(base64ToUrl(userData.slika));
        setIsLoading(false);
      }
    }
    async function startCropping() {
      if (typeof inputValue !== "undefined" && inputValue.length !== 0) {
        setIsCropping(true);
        try {
          const imageUrl = URL.createObjectURL(inputValue[0]);
          const res = await crop(imageUrl, 1);
          const url = base64ToUrl(formatBase64(res.toDataURL()));
          setImage(url);
        } catch (error) {
          console.error("Error cropping image:", error);
        } finally {
          setIsCropping(false);
        }
      }
    }

    loadPicture();
    startCropping();
  }, [inputValue]);

  async function onSubmit(formValues: FromValues) {
    const { value } = formValues;

    try {
      const croppedCanvas = await crop(URL.createObjectURL(value[0]), 1);

      const croppedBase64Image = croppedCanvas.toDataURL("image/jpeg");

      updateUser((prev) => ({
        ...prev!,
        slika: formatBase64(croppedBase64Image),
      }));
    } catch (error) {
      console.error("Failed to crop or convert the image:", error);
    }
  }

  return (
    <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.header}>
        <h3>Promenite vašu sliku</h3>
        <IoClose onClick={close} size="2rem" />
      </div>

      <div style={{overflow: 'scroll', height: window.innerWidth < 1000 ? '400px' : 'auto'}}>
        <div className={classes.imageContentContainer}>
          {isCropping ? (
            <div className={classes.marginBot}>
              <Hamster />
            </div>
          ) : image !== null ? (
            <img className={classes.previewImage} src={image} alt="image" />
          ) : (
            <div className={classes.placeholderContainer}>
              <div className={classes.imagePlaceholder}>
                <span>Izaberite sliku</span>
              </div>
            </div>
          )}

          <p>
            Mora biti vaša prava slika, na slici treba da vam se vidi celo lice a
            preporuka je da pozadina bude jedne boje i da pravi kontrast u odnosu
            na vaše lice
          </p>
          <input
            className={classes.inputfile}
            type="file"
            accept="image/png, image/jpeg"
            id="slika"
            {...register("value", {
              required: "Ovo je obavezno polje",
              validate: function (fieldValue) {
                const info = fieldValue[0].size <= 204800;
                return info || "Slika je veća od 200KB";
              },
            })}
          />
          <p className={classes.pError}>
            {errors.value?.message && <MdErrorOutline />}
            {errors.value?.message}
          </p>
        </div>

        {isLoading && <p>Učitavanje profilne slike...</p>}

        <InfoBox>
          <p>Slika se automatski kropuje na 1:1</p>
          <p>
            U narednim verzijama moći će te vi da kropujete sliku kada je
            postavljate
          </p>
        </InfoBox>
      </div>

      <div className={classes.btnContainer}>
        {typeof inputValue !== "undefined" && inputValue.length !== 0 ? (
          <>
            <label
              className={`${classes.labelfile} secondLink`}
              htmlFor="slika"
            >
              Promeni Sliku
            </label>
            <button
              disabled={isSubmitting}
              className={
                "mainButtonSmall" +
                " " +
                `${isSubmitting ? "button--loading" : ""}`
              }
            >
              <span className="button__text">Save</span>
            </button>
          </>
        ) : (
          <>
            <button className="secondLink" onClick={close} type="button">
              Cancel
            </button>
            <label
              className={`${classes.labelfile} mainButtonSmall`}
              htmlFor="slika"
            >
              <MdFileUpload size="1rem" />
              Izaberite sliku
            </label>
          </>
        )}
      </div>
    </form>
  );
}

export default EditSlika;
