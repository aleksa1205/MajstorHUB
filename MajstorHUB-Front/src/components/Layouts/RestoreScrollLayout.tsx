import { Outlet, ScrollRestoration } from "react-router-dom";

export default function RestoreScrollLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}