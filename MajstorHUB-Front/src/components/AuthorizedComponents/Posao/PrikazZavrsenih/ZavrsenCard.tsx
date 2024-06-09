import { GetZavrseniPosloviDTO, Recenzija } from '../../../../api/DTO-s/Posao/PosloviDTO';
import classes from './Zavrseni.module.css';
import ShowMore from '../../../Theme/ShowMoreContainer/ShowMore';
import { Rating } from '@mui/material';
import UserType from '../../../../lib/UserType';
import { formatDate, formatDoubleWithWhite } from '../../../../lib/utils';

type PropsValues = {
    posao: GetZavrseniPosloviDTO;
    openPopUp(posao: GetZavrseniPosloviDTO): void;
    userType: UserType
}

export default function ZavrsenCard({ posao, openPopUp, userType }: PropsValues) {
    const { 
        detaljiPosla: { naslov, cena }, 
        recenzije: { recenzijaIzvodjaca, recenzijaKorisnika} ,
        pocetakRadova,
        zavrsetakRadova,
    } = posao;

    const recenzija: Recenzija = userType === UserType.Korisnik ? recenzijaIzvodjaca : recenzijaKorisnika;

    return (
        <div className={classes.mainCont}>
            <div className={classes.card}>
                <h4 onClick={() => openPopUp(posao)}>
                    <span className="secondLink">
                        {naslov}
                    </span>
                </h4>
    
                <div className={classes.firstRow}>
                    <Rating
                        name="ocena"
                        size="small"
                        precision={0.5}
                        value={recenzija.ocena}
                        readOnly={true}
                        sx={{ gap: '0' }}
                    />
                    <span>
                        {recenzija.ocena}
                    </span>

                    <span>|</span>
    
                    <span className={classes.date}>
                        {formatDate(pocetakRadova)} - {' '}
                        {formatDate(zavrsetakRadova)}
                    </span>
                </div>
    
                {recenzija.opisRecenzije !== '' && (
                    <ShowMore text={`"${recenzija.opisRecenzije}"`} />
                )}
    
                <div>
                    {formatDoubleWithWhite(cena)} RSD
                </div>
            </div>
        </div>
    )
}