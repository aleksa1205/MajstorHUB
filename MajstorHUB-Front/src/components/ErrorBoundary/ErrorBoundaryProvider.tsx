import React from "react"
import Error from "./ErrorBoundaryPage"
import { ErrorBoundary } from "react-error-boundary"

type PropsValue = {
    children : React.ReactNode;
}

function ErrorBoundaryProvider({children} : PropsValue) {
    
    return (
        <ErrorBoundary FallbackComponent={Error}>
            {children}
        </ErrorBoundary>
    )
}

export default ErrorBoundaryProvider;