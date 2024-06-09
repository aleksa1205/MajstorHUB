import { AiOutlineThunderbolt } from "react-icons/ai";
import { PrijavaWithIzvodjacDTO } from "../../../../api/DTO-s/Prijave/PrijaveDTO"
import { Matching, bidBoostedThreshold, checkMatchingScore } from "../../../../api/controllers/usePrijavaController";
import { base64ToUrl, formatDate, formatDateBefore, formatDouble, formatDoubleWithWhite, getProfileUrl } from "../../../../lib/utils";
import classes from './PrijavaWithIzvCard.module.css';
import UserType from "../../../../lib/UserType";
import { LuHardHat } from "react-icons/lu";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import Vestine from "../../../Theme/Users/Struke/Vestine";
import ShowIskustvo from "../../../Theme/Users/Struke/ShowIskustvo";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShowMore from "../../../Theme/ShowMoreContainer/ShowMore";
import { CiMail } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import { IzvodjacOnPrijava } from "./PrijaveWithIzv";
import { Iskustvo } from "../../../../api/DTO-s/responseTypes";
import { StatusOglasa } from "../../../../api/DTO-s/Oglasi/OglasiDTO";

type PropsValues = {
    prijava: PrijavaWithIzvodjacDTO;
    openModal: () => void;
    setIzvodjac: React.Dispatch<React.SetStateAction<IzvodjacOnPrijava | null>>;
    oglasStatus: StatusOglasa;
}

export default function PrijavaWIthIzvCard({ prijava, openModal, setIzvodjac, oglasStatus }: PropsValues) {

    const [isSmallSize, setIsSmallSize] = useState<boolean>(window.innerWidth <= 800);

    useEffect(() => {
        function handler() {
            setIsSmallSize(window.innerWidth <= 800);
        }

        window.addEventListener('resize', handler);

        return () => window.removeEventListener('resize', handler)
    }, []);

    return (
          <section className={classes.card}>
                {!isSmallSize && (
                    <div>
                        <LeftSection prijava={prijava} />
                    </div>
                )}
                <AbsoluteButtons openModal={openModal} prijava={prijava} setIzvodjac={setIzvodjac} status={oglasStatus} />
                <AbsoluteMatch prijava={prijava} />
                <div>
                    <FirstRow prijava={prijava} isSmallSize={isSmallSize} />
                    <SecondRow prijava={prijava} />
                    <ThirdRow prijava={prijava} />
                    {/* <IskustvoRow prijava={prijava} /> */}
                    <OpisRow prijava={prijava} />
                    <MatchingStrukeRow prijava={prijava} />
                    <KontaktRow prijava={prijava} />
                    <LastRow prijava={prijava} />
                </div>
            </section>
    )
}

type RowProps = {
    prijava: PrijavaWithIzvodjacDTO
    isSmallSize?: boolean;
}

type AbsoluteButtonsProps = RowProps & {
    openModal: () => void;
    setIzvodjac: React.Dispatch<React.SetStateAction<IzvodjacOnPrijava | null>>;
    status: StatusOglasa;
}

function AbsoluteMatch({ prijava }: RowProps) {
    const { matchingScore } = prijava;
    const match = checkMatchingScore(matchingScore);

    return (
        <div className={classes.absoluteMatch}>
            {match === Matching.BestMatch && (
                <p className={classes.bestMatch}>Best Match</p>
            )}
            {match === Matching.GoodMatch && (
                <p className={classes.goodMatch}>Good Match</p>
            )}
        </div>
    )
}

function AbsoluteButtons({ prijava, openModal, setIzvodjac, status }: AbsoluteButtonsProps) {
    const { tipIzvodjaca, izvodjacId, naziv, ponuda, id } = prijava;

    function openForm() {
        setIzvodjac({
            izvodjacId,
            tipIzvodjaca,
            naziv,
            ponuda,
            prijava: id
        });
        openModal();
    }

    return (
        <div className={classes.absoluteButtons}>
            <Link to={getProfileUrl(tipIzvodjaca, izvodjacId)} className="secondaryButtonSmall">Pogledaj Profil</Link>
            {status === StatusOglasa.Otvoren && (
                <button onClick={openForm} className="mainButtonSmall">Zaposli</button>
            )}
        </div>
    )
}

function LeftSection({ prijava }: RowProps) {
    const { slika } = prijava;

    return (
        <div className={classes.leftSection}>
            {/* {match === Matching.BestMatch && (
                <p className={classes.bestMatch}>Best Match</p>
            )}
            {match === Matching.GoodMatch && (
                <p className={classes.goodMatch}>Good Match</p>
            )} */}
            <img src={base64ToUrl(slika)} alt="slika izvodjaca" />
        </div>
    )
}

function FirstRow({ prijava, isSmallSize }: RowProps) {
    const { naziv, bid, slika, datumKreiranja } = prijava
    
    return (
        <div className={classes.firstRow}>
            {isSmallSize && (
                <img src={base64ToUrl(slika)} alt="Profilna Slika" />
            )}
                <div>
                    <p className={classes.small}>Prijavio se {formatDateBefore(datumKreiranja)}</p>
                    
                    <div className={classes.nazivBoostedContainer}>
                        <h4>{naziv}</h4>
                        {bid > bidBoostedThreshold && (
                            <span>
                                <AiOutlineThunderbolt />
                                Boosted 
                            </span>
                        )}
                </div>
            </div>
            {/* <div>
                <button className="secondaryButtonSmall">Pogledaj Profil</button>
                <button className="mainButtonSmall">Zaposli</button>
            </div> */}
        </div>
    )
}

function SecondRow({ prijava }: RowProps) {
    const { tipIzvodjaca, adresa } = prijava;

    let icon = <></>;
    switch(tipIzvodjaca) {
        case UserType.Majstor:
            icon = <LuHardHat />
            break;
        case UserType.Firma:
            icon = <HiOutlineOfficeBuilding />
    }

    return (
        <div className={classes.secondRow}>
            <div>
                {icon}
                <span>{UserType[tipIzvodjaca]}</span>       
            </div>
            <div>
                <IoLocationOutline />
                <span>{adresa}</span>
            </div>
        </div>
    )
}

function ThirdRow({ prijava }: RowProps) {
    const { ponuda, zaradjeno, cenaPoSatu, iskustvo } = prijava;

    return (
        <div className={classes.thirdRow}>
            <p>Ponuda: {formatDoubleWithWhite(ponuda)} RSD</p>
            <p>{formatDouble(zaradjeno, 'zarađeno')}</p>
            <p>{formatDoubleWithWhite(cenaPoSatu)} RSD/sat</p>
            <p>{Iskustvo[iskustvo]}</p>
        </div>
    )
}

function IskustvoRow({ prijava }: RowProps) {
    const { iskustvo, tipIzvodjaca } = prijava;

    return (
        <div className={classes.iskustvoRow}>
            <ShowIskustvo iskustvo={iskustvo} userType={tipIzvodjaca} />
        </div>
    )
}

function OpisRow({ prijava }: RowProps) {
    const { opis } = prijava;

    return (
        <div className={classes.opisRow}>
            <ShowMore text={opis} />
        </div>
    )
}

function MatchingStrukeRow({ prijava }: RowProps) {
    const { matchingStruke } = prijava;

    return (
        <>
            {matchingStruke.length !== 0 && (
                <div className={classes.strukeRow}>
                    <p>Veštine izvođača koje se poklapaju sa vašim oglasom:</p>
                    <Vestine struke={matchingStruke} />
                </div>
            )}
        </>
    )
}

function KontaktRow({ prijava }: RowProps) {
    const { email, brojTelefona } = prijava;

    return (
        <div className={classes.contactRow}>
            <div>
                <CiMail />
                <div>{email}</div>
            </div>

            {brojTelefona && (
                <div>
                    <BsTelephone />
                    <div>{brojTelefona}</div>
                </div>
            )}
        </div>
    )
}

function LastRow({ prijava }: RowProps) {
    const { bid } = prijava;

    return (
        <div className={classes.lastRow}>
            <p>Bid za poziciju: {bid} RSD</p>
        </div>
    )
}