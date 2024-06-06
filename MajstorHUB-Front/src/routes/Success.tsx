import classes from "../components/ErrorBoundary/SuccErr.module.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import Lottie from 'react-lottie'
import animationData from '../../pictures/animations/successAnimation.json'
import { useEffect, useState } from "react";

type urlType = {
  message: string;
  to: string;
}

export function loader({ request }: any) {
  const url = new URL(request.url);
  const result : urlType = {
    message: url.searchParams.get("message") ?? '',
    to: url.searchParams.get("to") ?? '' 
  }
  return  result
}

function Success() {
  const {message, to} = useLoaderData() as urlType;
  const navigate = useNavigate();
  const [size, setSize] = useState<string>(window.innerWidth <= 600
    ? '2rem'
    : '2.5rem');

  const animOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  useEffect(() => {
    const id = setTimeout(() => {
      navigate('/' + to);
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    function func() {
      window.innerWidth <= 600
      ? setSize('2rem')
      : setSize('2.5rem')
    }

    window.addEventListener('resize', func);

    return () => window.removeEventListener('resize', func);
  }, []);

  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.success}>
        <Lottie options={animOptions} height={size} width={size}></Lottie>
        <div>
          <h3 className={classes.heading}>
              {message !== '' ? message : 'Uspešno ste izvršili akciju'}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Success;
