import { FaUser } from 'react-icons/fa';
import classes from './UserInfoAside.module.css'
import useCurrUser from '../../../hooks/useCurrUser';
import DottedLoader from '../../Loaders/DottedLoader';
import useAuth from '../../../hooks/useAuth';
import UserType  from '../../../lib/UserType';
import { GetFirmaResponse, GetKorisnikResponse, GetMajstorResponse, Iskustvo, Struka } from '../../../api/responseTypes';
import DropDownSlider, { DDSliderItem } from '../../Theme/DropDownSlider';

function UserInfoAside() {

    const { userData, isFetching, pictureUrl } = useCurrUser();
    const { auth } = useAuth();

    return (
        <aside className={classes.aside}>
            {isFetching ?
                <DottedLoader size='3rem' /> :

            (<>
                <div className={classes.firstSection}>
                    {isFetching ?
                        (<DottedLoader size='3rem' />) :
                        pictureUrl ?
                        (<img src={pictureUrl} alt='User Picture' />) : 
                        (<FaUser size='2rem' />)
                    }
                    <div>
                        <p>{auth.naziv}</p>
                        <p>{auth.userType !== UserType.Nedefinisano ? UserType[auth.userType] : ''}</p>
                    </div>
                </div>

                <div>
                    {userData?.userType === UserType.Korisnik &&
                    <KorisnikElements userData={userData} />}

                    {userData?.userType === UserType.Majstor &&
                    <MajstorElements userData={userData} />}

                    {userData?.userType === UserType.Firma &&
                    <FirmaElements userData={userData} />}
                </div>
            </>)

            }
        </aside>
    )
}

type UserPropValues = {
    userData : GetKorisnikResponse;
}

function KorisnikElements({ userData } : UserPropValues) {
    return (
        <>
            <DropDownSlider text='General Info'>
                <DDSliderItem>Email:<br /> {userData.email}</DDSliderItem>
                <DDSliderItem>JMBG:<br /> {userData.jmbg}</DDSliderItem>
                {userData.adresa &&
                    <DDSliderItem>Adresa:<br /> {userData.adresa}</DDSliderItem>
                }
                {userData.datumRodjenja && 
                    <DDSliderItem>Datum Rodjenja:<br /> {`${userData.datumRodjenja.getDay()}.${userData.datumRodjenja.getMonth()}.${userData.datumRodjenja.getFullYear()}.`}</DDSliderItem>
                }
                {userData.brojTelefona &&
                    <DDSliderItem>Broj Telefona:<br /> {userData.brojTelefona}</DDSliderItem>
                } 
            </DropDownSlider>

            <DropDownSlider text='Finansije'>
                <DDSliderItem>Novac:<br /> {userData.novacNaSajtu}</DDSliderItem>
                <DDSliderItem>Potroseno:<br /> {userData.potroseno}</DDSliderItem>
            </DropDownSlider>
        </>
    )
}

type MajstorPropValues = {
    userData : GetMajstorResponse;
}

function MajstorElements({userData} : MajstorPropValues) {
    return (
        <>
            <DropDownSlider text='General Info'>
                <DDSliderItem>Email:<br /> {userData.email}</DDSliderItem>
                <DDSliderItem>JMBG:<br /> {userData.jmbg}</DDSliderItem>
                {userData.adresa &&
                    <DDSliderItem>Adresa:<br /> {userData.adresa}</DDSliderItem>
                }
                {userData.datumRodjenja && 
                    <DDSliderItem>Datum Rodjenja:<br /> {`${userData.datumRodjenja.getDay()}.${userData.datumRodjenja.getMonth()}.${userData.datumRodjenja.getFullYear()}.`}</DDSliderItem>
                }
                {userData.brojTelefona &&
                    <DDSliderItem>Broj Telefona:<br /> {userData.brojTelefona}</DDSliderItem>
                } 
            </DropDownSlider>

            <DropDownSlider text='Finansije'>
                <DDSliderItem>Novac:<br /> {userData.novacNaSajtu}</DDSliderItem>
                <DDSliderItem>Zaradjeno:<br /> {userData.zaradjeno}</DDSliderItem>
            </DropDownSlider>

            <DropDownSlider text='Struka'>
                {userData.struka !== 0 && userData.struka &&
                    <DDSliderItem>{Struka[userData.struka]}</DDSliderItem>
                }

                {userData.iskustvo !== 0 && userData.iskustvo &&
                    <DDSliderItem>{Iskustvo[userData.iskustvo]}</DDSliderItem>
                }

                {userData.cenaPoSatu ?
                    <DDSliderItem>Cena po satu: {userData.cenaPoSatu} din</DDSliderItem> : ''
                }
            </DropDownSlider>
        </>
    )
}

type FirmaPropValues = {
    userData : GetFirmaResponse;
}

function FirmaElements({userData} : FirmaPropValues) {
    return (
        <>
            <DropDownSlider text='General Info'>
                <DDSliderItem>Email:<br /> {userData.email}</DDSliderItem>
                <DDSliderItem>PIB:<br /> {userData.pib}</DDSliderItem>
                {userData.brojTelefona &&
                    <DDSliderItem>Broj Telefona:<br /> {userData.brojTelefona}</DDSliderItem>
                } 
            </DropDownSlider>

            <DropDownSlider text='Finansije'>
                <DDSliderItem>Novac:<br /> {userData.novacNaSajtu}</DDSliderItem>
                <DDSliderItem>Zaradjeno:<br /> {userData.zaradjeno}</DDSliderItem>
            </DropDownSlider>

            <DropDownSlider text='Struka'>
                {userData.struke &&
                    userData.struke.map(el => {
                        return <DDSliderItem key={el}>{Struka[el]}</DDSliderItem>
                    })
                }

                {userData.iskustvo !== 0 && userData.iskustvo &&
                    <DDSliderItem>{Iskustvo[userData.iskustvo]}</DDSliderItem>
                }

                {userData.cenaPoSatu ?
                    <DDSliderItem>Cena po satu:<br /> {userData.cenaPoSatu} din</DDSliderItem> : ''
                }
            </DropDownSlider>
        </>
    )
}

export default UserInfoAside;