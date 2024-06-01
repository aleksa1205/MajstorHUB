import classes from "../components/ErrorBoundary/SuccErr.module.css";
import { useLoaderData, useNavigate } from "react-router-dom";
import Lottie from 'react-lottie'
import animationData from '../../pictures/animations/successAnimation.json'

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

  const animOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  setTimeout(() => {
    navigate('/' + to);
  }, 3000);

  return (
    <div className={`container ${classes.main}`}>
      <div className={classes.success}>
        <Lottie options={animOptions} height='2.5rem' width='2.5rem'></Lottie>
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
