import classes from './FirstBlock.module.css';

function FirstBlock() {
    return (
        <div className={`mainContainer ${classes.mainDiv}`}>
            <div>
                <h2>Pronađite idealnog partnera za svoj sledeći projekat</h2>
                <p>
                    Naša platforma vam omogućava da pronađete idealnog partnera za svaki građevinski projekat.
                    <br /><br />
                    Bez obzira da li vam je potreban majstor za renoviranje kuće, građevinski inženjer za dizajniranje novog objekta ili 
                    građevinski radnik za svakodnevne zadatke, mi vam pomažemo da pronađete stručnjaka koji odgovara vašim potrebama.
                    <br />
                    <br />
                    Pregledajte profile naših kvalifikovanih profesionalaca, pročitajte recenzije drugih korisnika i jednostavno se povežite sa 
                    osobom koja će učiniti vaš projekat uspešnim. Sa našom platformom, vaši građevinski snovi postaju stvarnost.
                </p>
                <button className='mainButton'>Pronađite Izvođače</button>
            </div>
            <img src='../../../pictures/searching.png' alt="searching pic" />
        </div>
    );
}

export default FirstBlock;