// @refresh reload
import {
  useLocation,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import RelayStoreContext from "./contexts/GlobalContext";

export default function Root() {
  const location = useLocation();

  return (
    <Html lang="en">
      <Head>
        <Title>arguflow app</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <ErrorBoundary>
          <RelayStoreContext>
            <Routes>
              <FileRoutes />
            </Routes>
          </RelayStoreContext>
        </ErrorBoundary>
        <Scripts />
      </Body>
    </Html>
  );
}