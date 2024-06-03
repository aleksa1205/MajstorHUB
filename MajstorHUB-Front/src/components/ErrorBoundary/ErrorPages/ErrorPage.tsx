import { useRouteError } from "react-router-dom";
import NotFound from "./NotFound";

export default function ErrorPage() {
  const err = useRouteError();
  const error  = err as Error;
  console.error(error);

  return (
        <div className="container" style={{textAlign: 'center'}}>
        {error.status === 404 ? (
          <NotFound />
        ) : (
          <>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
          </>
        )}
      </div>
  );
}