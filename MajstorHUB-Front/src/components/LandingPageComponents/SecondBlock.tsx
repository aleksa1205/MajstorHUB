import classes from "./SecondBlock.module.css";

function SecondBlock() {
  return (
    <div className={classes.mainDiv}>
      <div className={`container`}>
        <img src="../../../pictures/construction-transparent.png" alt="searching pic" />
        <div>
          <h2>Povećajte svoje mogućnosti zapošljavanja</h2>
          <p>
            Nudimo vam priliku da proširite svoje mogućnosti zapošljavanja i
            pronađete nove projekte koji odgovaraju vašim veštinama i iskustvu.
            <br />
            <br />
            Bez obzira da li ste građevinski radnik, arhitekta, ili inženjer,
            naša platforma vam pruža mogućnost da pronađete poslove koji
            odgovaraju vašim interesovanjima i rasporedu. Povežite se sa
            klijentima širom sveta, pokažite svoje veštine kroz svoj profil i
            recenzije zadovoljnih klijenata, i gradite uspešnu karijeru u
            građevinskoj industriji. <br />
            <br />
            Sa našom platformom, vaše mogućnosti su beskonačne.
          </p>
          <button className="mainButton">Pronađite Posao</button>
        </div>
      </div>
    </div>
  );
}

export default SecondBlock;
