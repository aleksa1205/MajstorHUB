import { Link } from 'react-router-dom';
import UserInfoAside from '../AsideComponents/UserInfoAside';
import classes from './Dashboard.module.css'
import { FaSearch, FaUser } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import useAuth from '../../../hooks/useAuth';
import UserType from '../../../lib/UserType';
import { getProfileUrl } from '../../../lib/utils';
import { MdAdd } from 'react-icons/md';
import ZapocetiPoslovi from '../Posao/PrikazZapocetih/ZapocetiPoslovi';

enum Icons {
    Search,
    User,
    Money
}

function Dashboard() {
    const { auth } = useAuth();
    const { userType : type } = auth;

    return (
        <main className={`container`}>
            <div className={classes.main}>
                <div className={classes.content}>

                    <div className={classes.firstBlock}>
                        <div>
                            <h3>Započeti poslovi</h3>
                            {auth.userType === UserType.Korisnik && 
                                <Link to='/postavi-oglas'>
                                    <button className='mainButtonSmall'>
                                        <MdAdd size='1.5rem' />
                                        Postavi Oglas
                                    </button>
                            </Link>
                            }
                            {auth.userType !== UserType.Korisnik && (
                                <Link to='/oglasi'>
                                    <button className='mainButtonSmall'>
                                        <FaSearch size='1rem' />
                                        Pronađi Posao
                                    </button>
                                </Link>
                            )}
                        </div>
                        <ZapocetiPoslovi />
                    </div>

                    <div className={classes.actions}>
                        {type === UserType.Korisnik && (
                            <>
                                <LinkCard
                                    to='/majstori'
                                    text='Novi Majstori'
                                    opis='Pretražite kvalifikovane majstore u vašoj oblasti.'
                                    icon={Icons.Search}
                                />
                                <LinkCard
                                    to='/firme'
                                    text='Nove Građevinske Firme'
                                    opis='Pretražite građevinske firme za uspešnu realizaciju vaših projekata.'
                                    icon={Icons.Search}
                                />
                                <LinkCard
                                    to={getProfileUrl(type, auth.userId)}
                                    text='Vaš Profil'
                                    opis='Izmenite informacije o vašem profilu.'
                                    icon={Icons.User}
                                />
                                <LinkCard
                                    to='/novac?tip=uplata'
                                    text='Uplatite novac na MajstorHUB'
                                    opis='Uplate su brze i pouzdane.'
                                    icon={Icons.Money}
                                />
                                <LinkCard
                                    to='/novac?tip=podizanje'
                                    text='Podignite novac sa MajstorHUB platforme'
                                    opis='Podizanje novca je brzo i pouzdano.'
                                    icon={Icons.Money}
                                />
                                <hr />
                                <h2>Sporedne Aktivnosti</h2>
                                <LinkCard 
                                    to='/klijenti' 
                                    text='Istražite Ostale Klijente'
                                    opis='Pretraga ostalih klijenata.'
                                    icon={Icons.Search}
                                />
                                <LinkCard 
                                    to='/oglasi' 
                                    text='Pretraga Oglasa'
                                    opis='Pretražite ostale oglase.'
                                    icon={Icons.Search}
                                />
                            </>
                        )}
                        {type !== UserType.Korisnik && (
                            <>
                                <LinkCard 
                                    to='/klijenti' 
                                    text='Novi Klijenti'
                                    opis='Pretražujte potencijalne klijente i proširite poslovanje.'
                                    icon={Icons.Search}
                                />
                                <LinkCard 
                                    to='/oglasi' 
                                    text='Pretraga Oglasa'
                                    opis='Pretražite oglase koji vama odgovaraju.'
                                    icon={Icons.Search}
                                />
                                <LinkCard
                                    to={getProfileUrl(type, auth.userId)}
                                    text='Vaš Profil'
                                    opis='Izmenite informacije o vašem profilu.'
                                    icon={Icons.User}
                                />
                                <LinkCard
                                    to='/novac?tip=uplata'
                                    text='Uplatite novac na MajstorHUB'
                                    opis='Uplate su brze i pouzdane.'
                                    icon={Icons.Money}
                                />
                                <LinkCard
                                    to='/novac?tip=podizanje'
                                    text='Podignite novac sa MajstorHUB platvofme'
                                    opis='Podizanje novca je brzo i pouzdano.'
                                    icon={Icons.Money}
                                />
                                <hr />
                                <h2>Sporedne Aktivnosti</h2>
                                <LinkCard
                                    to='/majstori'
                                    text='Ostali Majstori'
                                    opis='Pretražujte ostale majstore.'
                                    icon={Icons.Search}
                                />
                                <LinkCard
                                    to='/firme'
                                    text='Ostale Građevinske Firme'
                                    opis='Pretražite ostale građevinske firme.'
                                    icon={Icons.Search}
                                />
                            </>
                        )}
                    </div>
                </div>
                {/* <UserInfoAside /> */}
            </div>
        </main>
    )
}

export default Dashboard;

type LinkProps = {
    to: string;
    text: string;
    opis: string;
    icon: Icons;
}
function LinkCard({ to, opis, text, icon } : LinkProps) {
    let iconEl = <></>;
    const size = '1.5rem';
    switch (icon) {
        case Icons.Search:
            iconEl = <FaSearch size={size} />
            break;   
        case Icons.User:
            iconEl = <FaUser size={size} />
            break;
        case Icons.Money:
            iconEl = <FaMoneyBillTransfer size={size} />
            break;   
    }
    
    return (
        <section className={classes.sectionCard}>
            <Link to={to}>
                <div>
                    {iconEl}
                    <h3>{text}</h3>
                </div>
                <p>{opis}</p>
            </Link>
        </section>
    )
}

type InfoProps = {
    text: string;
    opis: string;
    icon: Icons;
}
function InfoCard({ opis, text, icon } : InfoProps) {
    let iconEl = <></>;
    const size = '1.5rem';
    switch (icon) {
        case Icons.Money:
            iconEl = <FaMoneyBillTransfer size={size} />
            break;   
    }
    
    return (
        <section className={classes.sectionCard}>
            <div>
                {iconEl}
                <h3>{text}</h3>
            </div>
            <p>{opis}</p>
        </section>
    )
}